using System.ComponentModel.DataAnnotations;

namespace DTO.CitasPeluqueria.Request.Cita
{
    public class CitaRequest
    {
        [Range(1, int.MaxValue, ErrorMessage = "Debe indicar un cliente válido.")]
        public int ClienteId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Debe indicar un estilista válido.")]
        public int EstilistaId { get; set; }

        [Required(ErrorMessage = "La fecha de la cita es obligatoria.")]
        public DateOnly? FechaCita { get; set; }

        [Required(ErrorMessage = "La hora de la cita es obligatoria.")]
        public TimeOnly? HoraCita { get; set; }

        [StringLength(500)]
        public string? Notas { get; set; }

        public byte Estado { get; set; } = 1;
    }
}