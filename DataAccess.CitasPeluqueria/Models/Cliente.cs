using System;
using System.Collections.Generic;

namespace DataAccess.CitasPeluqueria.Models;

public partial class Cliente
{
    public int ClienteId { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Telefono { get; set; }

    public string? Email { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaCreacion { get; set; }

    public virtual ICollection<Citum> Cita { get; set; } = new List<Citum>();
}
