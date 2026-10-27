using System;
using System.Collections.Generic;

namespace  Entities.CitasPeluqueria;

public partial class Especialidad
{
    public int EspecialidadId { get; set; }

    public string Nombre { get; set; } = null!;

    public bool Activo { get; set; }

    public DateTime FechaCreacion { get; set; }

    public virtual ICollection<Estilistum> Estilista { get; set; } = new List<Estilistum>();
}
