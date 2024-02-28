namespace GaiaMetrics.Extensions
{
    public static class AutorizationPolicyExtension
    {
        public static IServiceCollection AddAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                //Roles
                options.AddPolicy("RoleGet", policy =>
                    policy.RequireClaim("RoleClaim", "RoleGetClaim"));
                options.AddPolicy("RoleAdd", policy =>
                    policy.RequireClaim("RoleClaim", "RoleAddClaim"));
                options.AddPolicy("RoleUpdate", policy =>
                    policy.RequireClaim("RoleClaim", "RoleUpdateClaim"));
                options.AddPolicy("RoleDelete", policy =>
                    policy.RequireClaim("RoleClaim", "RoleDeleteClaim"));

                //Users
                options.AddPolicy("UserGetAll", policy =>
                    policy.RequireClaim("RoleClaim", "UsetGetAllClaim"));

                //Subscription plans
                options.AddPolicy("SubscriptionPlanGet", policy =>
                    policy.RequireClaim("RoleClaim", "SubscriptionPlanGetClaim"));
                options.AddPolicy("SubscriptionPlanCreate", policy =>
                    policy.RequireClaim("RoleClaim", "SubscriptionPlanCreateClaim"));
                options.AddPolicy("SubscriptionPlanDelete", policy =>
                    policy.RequireClaim("RoleClaim", "SubscriptionPlanDeleteClaim"));

                //IoT Devices
                options.AddPolicy("IoTDeviceGet", policy =>
                    policy.RequireClaim("RoleClaim", "IoTDeviceGetClaim"));
                options.AddPolicy("IoTDeviceCreate", policy =>
                    policy.RequireClaim("RoleClaim", "IoTDeviceCreateClaim"));

                //Device groups
                options.AddPolicy("DeviceGroupGet", policy =>
                    policy.RequireClaim("RoleClaim", "DeviceGroupGetClaim"));
                options.AddPolicy("DeviceGroupCreate", policy =>
                    policy.RequireClaim("RoleClaim", "DeviceGroupCreateClaim"));
                options.AddPolicy("DeviceGroupUpdate", policy =>
                    policy.RequireClaim("RoleClaim", "DeviceGroupUpdateClaim"));
                options.AddPolicy("DeviceGroupDelete", policy =>
                    policy.RequireClaim("RoleClaim", "DeviceGroupDeleteClaim"));
            });

            return services;
        }
    }
}
