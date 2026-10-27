using System.ComponentModel.DataAnnotations;

namespace DTO.CitasPeluqueria.Request.Estilistum
{
    public class EstilistumRequest
    {
        [Required, StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Debe indicar una especialidad válida.")]
        public int EspecialidadId { get; set; }
        

        [StringLength(20)]
        public string? Telefono { get; set; }

        [EmailAddress, StringLength(100)]
        public string? Email { get; set; }

        public bool Activo { get; set; } = true;
    }
}