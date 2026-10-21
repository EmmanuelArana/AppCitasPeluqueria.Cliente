using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.CitasPeluqueria.Response.Especialidad
{
    public class EspecialidadResponse
    {
        public int EspecialidadId { get; set; }

        public string Nombre { get; set; } = null!;

        public bool Activo { get; set; }

        public DateTime FechaCreacion { get; set; }


    }
}
