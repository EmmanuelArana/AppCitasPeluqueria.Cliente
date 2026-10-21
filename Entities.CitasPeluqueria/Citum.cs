using System;
using System.Collections.Generic;

namespace  Entities.CitasPeluqueria;

public partial class Citum
{
    public int CitaId { get; set; }

    public int ClienteId { get; set; }

    public int EstilistaId { get; set; }

    public DateOnly FechaCita { get; set; }

    public TimeOnly HoraCita { get; set; }

    public string? Notas { get; set; }

    public byte Estado { get; set; }

    public DateTime FechaCreacion { get; set; }

    public virtual Cliente Cliente { get; set; } = null!;

    public virtual Estilistum Estilista { get; set; } = null!;
}
