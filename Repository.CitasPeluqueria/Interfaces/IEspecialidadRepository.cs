using Entities.CitasPeluqueria;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository.CitasPeluqueria.Interfaces
{
    public interface IEspecialidadRepository
    {
        Task<List<Especialidad>> Listar();
    }
}
