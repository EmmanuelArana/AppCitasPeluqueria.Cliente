using System;
using System.Collections.Generic;

namespace  Entities.CitasPeluqueria;

public partial class Estilistum
{
    public int EstilistaId { get; set; }

    public string Nombre { get; set; } = null!;

    public int EspecialidadId { get; set; }

    public string? Telefono { get; set; }

    public string? Email { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaCreacion { get; set; }

    public virtual ICollection<Citum> Cita { get; set; } = new List<Citum>();

    public virtual Especialidad Especialidad { get; set; } = null!;
}
