using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace RapidaQuickstart.DotNet.Controllers
{
    [ApiController]
    [Route("api")]
    public class RootController : ControllerBase
    {
        private readonly IStringLocalizer<RootController> _localizer;

        public RootController(IStringLocalizer<RootController> localizer)
        {
            _localizer = localizer;
        }

        [HttpGet]
        public IActionResult GetHello()
        {
            var message = _localizer["Hello World"];
            return Ok(message);
        }
    }
}
