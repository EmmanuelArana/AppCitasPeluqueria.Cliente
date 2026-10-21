using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.CitasPeluqueria.Interfaces;

namespace API.CitasPeluqueria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EspecialidadController : ControllerBase
    {
        private readonly IEspecialidadRepository _repositorio;
        public EspecialidadController(IEspecialidadRepository repositorio)
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
