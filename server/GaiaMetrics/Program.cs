using GaiaMetrics;
using GaiaMetrics.Extensions;
using GaiaMetrics.Services;
using GaiaMetrics.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MQTTnet;
using MQTTnet.Client;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    //Set up swagger authorize button
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                   {
                     new OpenApiSecurityScheme
                     {
                       Reference = new OpenApiReference
                       {
                         Type = ReferenceType.SecurityScheme,
                         Id = "Bearer"
                       }
                      },
                      new string[] { }
                    }
                  });
});

//Set up DB context and DB connection
builder.Services.AddDbContext<GaiaMetricsDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("LocalConnection"));
});

//Enable JWT authenitcation
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

//Set up authorization policies
AutorizationPolicyExtension.AddAuthorization(builder.Services);

ConfigurationManager configuration = builder.Configuration;

//Map broker host settings
BrokerHostSettings brokerHostSettings = new BrokerHostSettings();
configuration.GetSection(nameof(BrokerHostSettings)).Bind(brokerHostSettings);

//Map client settings
ClientSettings clientSettings = new ClientSettings();
configuration.GetSection(nameof(ClientSettings)).Bind(clientSettings);


//Set up service class to interface mappings, set up services for dependency injection
ServiceCollectionExtension.AddServices(builder.Services);

// Add services to the container.
builder.Services.AddScoped(sp =>
{
    var options = new MqttClientOptionsBuilder()
        .WithClientId("ClientId")
        .WithTcpServer(brokerHostSettings.Host, brokerHostSettings.Port)
        .WithCredentials(clientSettings.UserName, clientSettings.Password)
        .Build();

    return options;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();
