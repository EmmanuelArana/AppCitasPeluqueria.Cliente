using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository.CitasPeluqueria.Implementaciones
{
    public class EstilistumRepository : IEstilistumRepository
    {
        private readonly CitasPeluqueriaContext _bd;
        public EstilistumRepository(CitasPeluqueriaContext bd)
        {
            _bd = bd;
        }
        // async permite utilizar await dentro del método,await permite esperar a que una tarea asincrónica 
        public async Task<List<Estilistum>> Listar()
        {
            return await _bd.Estilista
                .AsNoTracking()
                .Include(e => e.Especialidad)
                .Include(e => e.Cita)
                .OrderBy(e => e.Nombre)
                .ToListAsync();
        }

        public async Task<Estilistum?> ObtenerPorId(int id)
        {
            return await _bd.Estilista
                .Include(e => e.Especialidad)
                .Include(e => e.Cita)
                .FirstOrDefaultAsync(e => e.EstilistaId == id);
        }

        public async Task<Estilistum> Crear(Estilistum entidad)
        {
            await _bd.Estilista.AddAsync(entidad);
            await _bd.SaveChangesAsync();
            return entidad;
        }
        public async Task<bool> TieneCitasPendientes(int estilistaId)
        {
            var hoy = DateOnly.FromDateTime(DateTime.Now);  

            return await _bd.Cita.AnyAsync(c =>
                c.EstilistaId == estilistaId
                && c.FechaCita >= hoy
                && c.Estado != 3
                && c.Estado != 2);
        }

        public async Task Actualizar(Estilistum entidad)
        {
            _bd.Estilista.Update(entidad);
            await _bd.SaveChangesAsync();
        }

        public async Task<bool> TieneCitas(int estilistaId)
        {
            return await _bd.Cita.AnyAsync(c => c.EstilistaId == estilistaId);
        }

        public async Task Eliminar(Estilistum entidad)
        {
            _bd.Estilista.Remove(entidad);
            await _bd.SaveChangesAsync();
        }

        public async Task<bool> ExisteEspecialidad(int especialidadId)
        {
            return await _bd.Especialidad
                .AnyAsync(e => e.EspecialidadId == especialidadId && e.Activo);
        }
    }
}
