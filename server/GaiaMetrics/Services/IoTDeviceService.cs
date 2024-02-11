using GaiaMetrics.Models.ApiResponse;
using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics.Services
{
    public class IoTDeviceService : IIoTDeviceService
    {
        private readonly GaiaMetricsDbContext _dbContext;
        public IoTDeviceService(GaiaMetricsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponseData<ICollection<IoTDeviceGetResponse>>> GetAll()
        {
            var data = _dbContext.IoTDevices.Select(x => new IoTDeviceGetResponse
            {
                Id = x.Id,
                Name = x.Name,
                Latitude = x.Latitude,
                Longtitude = x.Longtitude
            }).ToList();

            return ApiResponseData<ICollection<IoTDeviceGetResponse>>.CorrectResponse(data);
        }

        public async Task<ApiResponse> Register(IoTDeviceRegisterRequest request)
        {
            var doesNameExist = await _dbContext.IoTDevices.AnyAsync(x => x.Name == request.Name);
            if (doesNameExist)
            {
                return ApiResponse.BadResponse(nameof(IoTDevice), Constants.ALREADY_EXISTS);
            }

            var newDevice = new IoTDevice
            {
                Name = request.Name,
                Latitude = request.Latitude,
                Longtitude = request.Longtitude,
                DeviceGroup = await _dbContext.DeviceGroups.FirstOrDefaultAsync(x => x.Id == request.DeviceGroupId)
            };

            await _dbContext.IoTDevices.AddAsync(newDevice);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }
    }
}
