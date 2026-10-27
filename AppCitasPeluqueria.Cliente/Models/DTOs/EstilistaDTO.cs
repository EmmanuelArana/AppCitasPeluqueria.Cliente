namespace PeluqueriaFrontEnd.Models.DTOs
{
    public class Estilista
    {
        public int EstilistaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int EspecialidadId { get; set; }
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
