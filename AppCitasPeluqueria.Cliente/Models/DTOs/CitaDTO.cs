namespace PeluqueriaFrontEnd.Models.DTOs
{
    public class Cita
    {
        public int CitaId { get; set; }
        public int ClienteId { get; set; }
        public int EstilistaId { get; set; }
        public DateTime FechaCita { get; set; }
        public TimeSpan HoraCita { get; set; }
        public string Notas { get; set; } = string.Empty;
        public byte Estado { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
