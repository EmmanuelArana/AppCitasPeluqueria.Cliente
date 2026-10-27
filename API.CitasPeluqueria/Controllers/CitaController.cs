using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Cita;
using DTO.CitasPeluqueria.Response.Cita;
using Microsoft.AspNetCore.Mvc;

namespace API.CitasPeluqueria.Controllers
{
    [Route("api/citas")]
    [ApiController]
    public class CitaController : ControllerBase
    {
        private readonly ICitaNegocio _negocio;
        private readonly ILogger<CitaController> _logger;

        public CitaController(
            ICitaNegocio negocio,
            ILogger<CitaController> logger)
        {
            _negocio = negocio;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CitaResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var lista = await _negocio.Listar();
                return Ok(lista);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar la solicitud.");

                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error al procesar la solicitud."
                });
            }
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(CitaResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var datos = await _negocio.ObtenerPorId(id);

                if (datos == null)
                    return NotFound(new { mensaje = "No se encontró el registro." });

                return Ok(datos);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar la solicitud.");

                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error al procesar la solicitud."
                });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(CitaResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Crear(CitaRequest datos)
        {
            try
            {
                var creado = await _negocio.Crear(datos);

                return CreatedAtAction(
                    nameof(ObtenerPorId),
                    new { id = creado.CitaId },
                    creado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar la solicitud.");

                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error al procesar la solicitud."
                });
            }
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Actualizar(int id, CitaRequest datos)
        {
            try
            {
                var actualizado = await _negocio.Actualizar(id, datos);

                if (!actualizado)
                    return NotFound(new { mensaje = "No se encontró el registro." });

                return Ok(new
                {
                    mensaje = "Registro actualizado correctamente."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar la solicitud.");

                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error al procesar la solicitud."
                });
            }
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var eliminado = await _negocio.Eliminar(id);

                if (!eliminado)
                    return NotFound(new { mensaje = "No se encontró el registro." });

                return Ok(new
                {
                    mensaje = "Registro eliminado correctamente."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar la solicitud.");

                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error al procesar la solicitud."
                });
            }
        }
    }
}