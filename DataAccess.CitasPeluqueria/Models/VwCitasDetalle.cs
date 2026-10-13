using System;
using System.Collections.Generic;

namespace DataAccess.CitasPeluqueria.Models;

public partial class VwCitasDetalle
{
    public int CitaId { get; set; }

    public int ClienteId { get; set; }

    public string Cliente { get; set; } = null!;

    public int EstilistaId { get; set; }

    public string Estilista { get; set; } = null!;

    public int EspecialidadId { get; set; }

    public string Especialidad { get; set; } = null!;

    public DateOnly FechaCita { get; set; }

    public TimeOnly HoraCita { get; set; }

    public string? Notas { get; set; }

    public byte Estado { get; set; }
}
