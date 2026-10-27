using System.ComponentModel.DataAnnotations;

namespace DTO.CitasPeluqueria.Request.Cliente
{
    public class ClienteRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(150, ErrorMessage = "El nombre admite hasta 150 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(30)]
        public string? Telefono { get; set; }

        [EmailAddress(ErrorMessage = "El correo no tiene un formato válido.")]
        [StringLength(150)]
        public string? Email { get; set; }

        public bool Activo { get; set; } = true;
    }
}