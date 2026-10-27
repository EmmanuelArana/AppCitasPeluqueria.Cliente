namespace PeluqueriaFrontEnd.Models.DTOs
{
    public class Cliente
    {
        public int ClienteId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
