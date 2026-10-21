using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.CitasPeluqueria.Interfaces;

namespace API.CitasPeluqueria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstilistumController : ControllerBase
    {
        private readonly IEstilistumRepository _repositorio;
        public EstilistumController(IEstilistumRepository repositorio)
        {
            _repositorio = repositorio;

        }
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var dats = await _repositorio.Listar();
            return Ok(dats);

        }
    }
}
