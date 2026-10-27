using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Estilistum;
using Microsoft.AspNetCore.Mvc;

namespace API.CitasPeluqueria.Controllers
{
    [Route("api/estilistas")]
    [ApiController]
    public class EstilistumController : ControllerBase
    {
        private readonly IEstilistumNegocio _negocio;

        public EstilistumController(IEstilistumNegocio negocio)
        {
            _negocio = negocio;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var datos = await _negocio.Listar();
            return Ok(datos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var dato = await _negocio.ObtenerPorId(id);
            return dato == null ? NotFound() : Ok(dato);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] EstilistumRequest datos)
        {
            try
            {
                var creado = await _negocio.Crear(datos);
                return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.EstilistaId }, creado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] EstilistumRequest datos)
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var ok = await _negocio.Eliminar(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
