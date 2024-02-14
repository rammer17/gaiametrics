using GaiaMetrics.Interfaces;
using GaiaMetrics.Services;
using MQTTnet;
using MQTTnet.Client;

namespace GaiaMetrics.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<ICryptographyService, CryptographyService>();
            services.AddScoped<IDeviceGroupService, DeviceGroupService>();
            services.AddScoped<IIoTDeviceService, IoTDeviceService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<ISubscriptionPlanService, SubscriptionPlanService>();
            services.AddScoped<IUserService, UserService>();
            services.AddSingleton<IMqttClient>(sp =>
            {
                var factory = new MqttFactory();
                return factory.CreateMqttClient();
            });
            services.AddSingleton<IMqttService, MqttService>();

            return services;
        }
    }
}
