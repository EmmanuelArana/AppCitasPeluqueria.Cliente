namespace DTO.CitasPeluqueria.Response.Cliente
{
    public class ClienteResponse
    {
        public int ClienteId { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Telefono { get; set; }

        public string? Email { get; set; }

        public bool Activo { get; set; }

        public DateTime FechaCreacion { get; set; }
    }
}