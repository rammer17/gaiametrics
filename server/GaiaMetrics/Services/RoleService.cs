using GaiaMetrics.Interfaces;
using GaiaMetrics.Models.ApiResponse;
using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics.Services
{
    public class RoleService : IRoleService
    {
        private readonly GaiaMetricsDbContext _dbContext;
        public RoleService(GaiaMetricsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse> Add(RoleAddRequest request)
        {
            if (await _dbContext.Roles.AnyAsync(x => x.Name == request.Name))
            {
                return ApiResponse.BadResponse(nameof(Role), Constants.ALREADY_EXISTS);
            }

            var roleToAdd = new Role()
            {
                Id = request.Id,
                Name = request.Name
            };
            await _dbContext.Roles.AddAsync(roleToAdd);

            if (request.Claims.Count == 0)
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(nameof(Claim), Constants.SHORT);
            }

            List<Claim> roleClaims = new List<Claim>();
            foreach (var claim in request.Claims)
            {
                if (_dbContext.Claims.Any(x => x.Name == claim))
                {
                    roleClaims.Add(_dbContext.Claims.First(x => x.Name == claim));
                }
                else
                {
                    Claim newClaim = new Claim();
                    newClaim.Name = claim;
                    await _dbContext.Claims.AddAsync(newClaim);
                    roleClaims.Add(newClaim);
                }
            }

            var newRoleClaims = roleClaims
                .Distinct()
                .Select(x => new RoleClaim()
                {
                    Role = roleToAdd,
                    Claim = x
                });
            await _dbContext.RoleClaims.AddRangeAsync(newRoleClaims);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }

        public async Task<ApiResponse> Delete(int id)
        {
            var roleForDelete = await _dbContext.Roles.FirstOrDefaultAsync(x => x.Id == id);

            if (roleForDelete is null)
            {
                return ApiResponse.BadResponse(nameof(Role), Constants.NOT_FOUND);

            }

            _dbContext.Roles.Remove(roleForDelete);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }

        public async Task<ApiResponseData<ICollection<RoleGetResponse>>> GetAll()
        {
            var roles = await _dbContext.Roles.Select(x => new RoleGetResponse()
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();

            foreach (var role in roles)
            {
                role.Claims = _dbContext.RoleClaims.Where(x => x.RoleId == role.Id).Select(x => x.Claim.Name);
            }

            return ApiResponseData<ICollection<RoleGetResponse>>.CorrectResponse(roles);
        }

        public async Task<ApiResponse> Update(RoleUpdateRequest request)
        {
            var roleToUpdate = await _dbContext.Roles.FirstOrDefaultAsync(x => x.Id == request.CurrentId);

            if (roleToUpdate is null)
            {
                return ApiResponse.BadResponse(nameof(Role), Constants.NOT_FOUND);
            }

            roleToUpdate.Name = request.Name;
            if (request.Claims.Count != 0)
            {
                if (request.Claims.Any(x => x == string.Empty))
                {
                    return ApiResponseData<UserLoginResponse>.BadResponse(nameof(Claim), Constants.SHORT);
                }

                List<Claim> roleClaims = new List<Claim>();
                foreach (var claim in request.Claims)
                {
                    if (_dbContext.Claims.Any(x => x.Name == claim))
                    {
                        roleClaims.Add(await _dbContext.Claims.FirstAsync(x => x.Name == claim));
                    }
                    else
                    {
                        Claim newClaim = new Claim();
                        newClaim.Name = claim;
                        await _dbContext.Claims.AddAsync(newClaim);
                        roleClaims.Add(newClaim);
                    }
                }

                var currentRoleClaims = _dbContext.RoleClaims.Where(x => x.RoleId == request.CurrentId);
                _dbContext.RoleClaims.RemoveRange(currentRoleClaims);

                var newRoleClaims = roleClaims.Distinct()
                    .Select(x => new RoleClaim()
                    {
                        Role = roleToUpdate,
                        Claim = x
                    });
                await _dbContext.RoleClaims.AddRangeAsync(newRoleClaims);
            }
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }
    }
}
