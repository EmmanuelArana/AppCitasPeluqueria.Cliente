using System;
using System.Collections.Generic;

namespace DTO.CitasPeluqueria.Response.Estilistum
{
    public class EstilistumResponse
    {
        public int EstilistaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int EspecialidadId { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }

        public EspecialidadDto? Especialidad { get; set; }
        public List<CitaDto> Citas { get; set; } = new();
    }

    public class EspecialidadDto
    {
        public int EspecialidadId { get; set; }
        public string? Nombre { get; set; }
    }

    public class CitaDto
    {
        public int CitaId { get; set; }
        public DateOnly FechaCita { get; set; }
        public TimeOnly HoraCita { get; set; }
        public byte Estado { get; set; }
    }
}