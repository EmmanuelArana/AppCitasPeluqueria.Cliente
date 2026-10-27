using System.ComponentModel.DataAnnotations;

namespace DTO.CitasPeluqueria.Request.Especialidad
{
    public class EspecialidadRequest
    {
        [Required, StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;
    }
}