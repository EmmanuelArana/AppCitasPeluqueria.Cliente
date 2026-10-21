using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Repository.CitasPeluqueria.Implementaciones
{
    public class EspecialidadRepository : IEspecialidadRepository
    {
        private readonly CitasPeluqueriaContext _bd;
        public EspecialidadRepository(CitasPeluqueriaContext bd)
        {
            _bd = bd;
        }

        public async Task<List<Especialidad>> Listar()
        {
            return await _bd.Especialidad.Where(p => p.Activo == true).ToListAsync();
        }
    }
}
