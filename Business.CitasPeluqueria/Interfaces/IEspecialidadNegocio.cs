using DTO.CitasPeluqueria.Response.Especialidad;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.CitasPeluqueria.Interfaces
{
    public interface IEspecialidadNegocio
    {
        Task<List<EspecialidadResponse>> Listar();
    }
}
