using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Especialidad;
using Microsoft.AspNetCore.Mvc;

namespace API.CitasPeluqueria.Controllers
{
    [Route("api/especialidades")]
    [ApiController]
    public class EspecialidadController : ControllerBase
    {
        private readonly IEspecialidadNegocio _negocio;

        public EspecialidadController(IEspecialidadNegocio negocio)
        {
            _negocio = negocio;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
            => Ok(await _negocio.Listar());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var dato = await _negocio.ObtenerPorId(id);
            return dato == null ? NotFound() : Ok(dato);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] EspecialidadRequest datos)
        {
            try
            {
                var creada = await _negocio.Crear(datos);
                return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.EspecialidadId }, creada);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] EspecialidadRequest datos)
        {
            try
            {
                var ok = await _negocio.Actualizar(id, datos);
                return ok ? NoContent() : NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}