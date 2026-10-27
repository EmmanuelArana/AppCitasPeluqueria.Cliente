namespace PeluqueriaFrontEnd.Models.DTOs
{
    public class Especialidad
    {
        public int EspecialidadId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
