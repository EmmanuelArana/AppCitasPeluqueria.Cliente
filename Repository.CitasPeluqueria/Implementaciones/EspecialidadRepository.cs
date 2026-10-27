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
            return await _bd.Especialidad.ToListAsync();
        }
        public async Task<Especialidad?> ObtenerPorId(int id)
        {
            return await _bd.Especialidad
                .FirstOrDefaultAsync(e => e.EspecialidadId == id);
        }

        public async Task<Especialidad> Crear(Especialidad entidad)
        {
            await _bd.Especialidad.AddAsync(entidad);
            await _bd.SaveChangesAsync();
            return entidad;
        }

        public async Task Actualizar(Especialidad entidad)
        {
            _bd.Especialidad.Update(entidad);
            await _bd.SaveChangesAsync();
        }

        public async Task<bool> ExisteNombre(string nombre, int? excluirId = null)
        {
            return await _bd.Especialidad
                .AnyAsync(e => e.Nombre == nombre && e.EspecialidadId != excluirId);
        }

        public async Task<bool> TieneEstilistasActivos(int especialidadId)
        {
            return await _bd.Estilista
                .AnyAsync(e => e.EspecialidadId == especialidadId && e.Activo);
        }
    }
}
