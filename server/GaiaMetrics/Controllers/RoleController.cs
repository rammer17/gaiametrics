using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private GaiaMetricsDbContext _dbContext;
        public RoleController(GaiaMetricsDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleGet")]
        public ActionResult<List<RoleGetResponse>> GetAll()
        {
            var roles = _dbContext.Roles.Select(x => new RoleGetResponse()
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();

            foreach (var role in roles)
            {
                role.Claims = _dbContext.RoleClaims.Where(x => x.RoleId == role.Id).Select(x => x.Claim.Name);
            }

            return Ok(roles);
        }
        [HttpPost]
/*        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleAdd")]
*/        public ActionResult Add(RoleAddRequest request)
        {
            if (_dbContext.Roles.Any(x => x.Name == request.Name))
            {
                return BadRequest("A role with the given name already exists.");
            }

            var roleToAdd = new Role()
            {
                Id = request.Id,
                Name = request.Name
            };
            _dbContext.Roles.Add(roleToAdd);

            if (request.Claims.Count == 0)
            {
                return BadRequest("Roles can not have 0 claims. If you intended to have no claims for this role add the \"DefaultClaim\" claim");
            }

            List<Claim> roleClaims = new List<Claim>();
            foreach (var claim in request.Claims)
            {
                if (_dbContext.Claims.Any(x => x.Name == claim))
                {
                    roleClaims.Add(_dbContext.Claims.Where(x => x.Name == claim).First());
                }
                else
                {
                    Claim newClaim = new Claim();
                    newClaim.Name = claim;
                    _dbContext.Claims.Add(newClaim);
                    roleClaims.Add(newClaim);
                }
            }

            var newRoleClaims = roleClaims.Distinct()
            .Select(x => new RoleClaim()
            {
                Role = roleToAdd,
                Claim = x
            });
            _dbContext.RoleClaims.AddRange(newRoleClaims);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPut]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleUpdate")]
        public ActionResult Update(RoleUpdateRequest request)
        {
            var roleToUpdate = _dbContext.Roles.Where(x => x.Id == request.CurrentId).FirstOrDefault();

            if (roleToUpdate == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            roleToUpdate.Name = request.Name;
            
            if (request.Claims.Count != 0)
            {
                if (request.Claims.Any(x => x == string.Empty))
                {
                    return BadRequest("Can not have an empty claim");
                }

                List<Claim> roleClaims = new List<Claim>();
                foreach (var claim in request.Claims)
                {
                    if (_dbContext.Claims.Any(x => x.Name == claim))
                    {
                        roleClaims.Add(_dbContext.Claims.Where(x => x.Name == claim).First());
                    }
                    else
                    {
                        Claim newClaim = new Claim();
                        newClaim.Name = claim;
                        _dbContext.Claims.Add(newClaim);
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
                _dbContext.RoleClaims.AddRange(newRoleClaims);
            }
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleDelete")]
        public ActionResult Delete(int id)
        {
            var roleForDelete = _dbContext.Roles.Where(x => x.Id == id).FirstOrDefault();

            if (roleForDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            _dbContext.Roles.Remove(roleForDelete);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
