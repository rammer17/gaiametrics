using GaiaMetrics.Models.ApiResponse;
using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics.Services
{
    public class DeviceGroupService : IDeviceGroupService
    {
        private readonly GaiaMetricsDbContext _dbContext;

        public DeviceGroupService(GaiaMetricsDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<ApiResponseData<ICollection<DeviceGroupGetResponse>>> GetAll()
        {
            var data = _dbContext.DeviceGroups.Select(x => new DeviceGroupGetResponse
            {
                Id = x.Id,
                Name = x.Name,
                Devices = x.Devices.Select(y => new IoTDeviceGetResponse
                {
                    Id = y.Id,
                    Name = y.Name,
                    Latitude = y.Latitude,
                    Longtitude = y.Longtitude,
                    Data = y.Data
                }).ToList()
            }).ToList();

            return ApiResponseData<ICollection<DeviceGroupGetResponse>>.CorrectResponse(data);
        }

        public async Task<ApiResponse> Register(DeviceGroupAddRequest request)
        {
            var doesNameExist = await _dbContext.DeviceGroups.AnyAsync(x => x.Name == request.Name);
            if (doesNameExist)
            {
                return ApiResponse.BadResponse(nameof(DeviceGroup), Constants.ALREADY_EXISTS);
            }

            var newDeviceGroup = new DeviceGroup
            {
                Name = request.Name,
                Devices = _dbContext.IoTDevices.Where(x => request.DeviceIds.Contains(x.Id)).ToList(),
                Users = _dbContext.Users.Where(x => request.UserIds.Contains(x.Id)).ToList(),
            };

            await _dbContext.DeviceGroups.AddAsync(newDeviceGroup);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }

        public async Task<ApiResponse> Update(DeviceGroupUpdateRequest request)
        {
            var deviceGroup = await _dbContext.DeviceGroups.FirstOrDefaultAsync(x => x.Id == request.Id);

            if (deviceGroup is null)
            {
                return ApiResponse.BadResponse(nameof(DeviceGroup), Constants.NOT_FOUND);
            }

            deviceGroup.Name = request.Name;
            deviceGroup.Devices = await _dbContext.IoTDevices.Where(x => request.DeviceIds.Contains(x.Id)).ToListAsync();
            deviceGroup.Users = await _dbContext.Users.Where(x => request.UserIds.Contains(x.Id)).ToListAsync();

            _dbContext.Update(deviceGroup);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }

        public async Task<ApiResponse> Delete(int id)
        {
            var deviceGroupForDelete = await _dbContext.DeviceGroups.Include(x => x.Devices).Include(y => y.Users).FirstOrDefaultAsync(x => x.Id == id);

            if (deviceGroupForDelete is null)
            {
                return ApiResponse.BadResponse(nameof(DeviceGroup), Constants.NOT_FOUND);
            }

            _dbContext.DeviceGroups.Remove(deviceGroupForDelete);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }
    }
}
