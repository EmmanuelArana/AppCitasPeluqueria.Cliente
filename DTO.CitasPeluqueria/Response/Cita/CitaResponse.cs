namespace DTO.CitasPeluqueria.Response.Cita
{
    public class CitaResponse
    {
        public int CitaId { get; set; }

        public int ClienteId { get; set; }

        public string Cliente { get; set; } = string.Empty;

        public int EstilistaId { get; set; }

        public string Estilista { get; set; } = string.Empty;

        public DateOnly FechaCita { get; set; }

        public TimeOnly HoraCita { get; set; }

        public string? Notas { get; set; }

        public byte Estado { get; set; }

        public DateTime FechaCreacion { get; set; }
    }
}