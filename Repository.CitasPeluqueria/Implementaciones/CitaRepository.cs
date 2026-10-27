using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Interfaces;

namespace Repository.CitasPeluqueria.Implementaciones
{
    public class CitaRepository : ICitaRepository
    {
        private readonly CitasPeluqueriaContext _bd;

        public CitaRepository(CitasPeluqueriaContext bd)
        {
            _bd = bd;
        }

        public async Task<List<Citum>> Listar()
        {
            return await _bd.Cita
                .Include(p => p.Cliente)
                .Include(p => p.Estilista)
                .OrderBy(p => p.CitaId)
                .ToListAsync();
        }

        public async Task<Citum?> ObtenerPorId(int id)
        {
            return await _bd.Cita
                .Include(p => p.Cliente)
                .Include(p => p.Estilista)
                .FirstOrDefaultAsync(p => p.CitaId == id);
        }

        public async Task<Citum> Crear(Citum entidad)
        {
            await _bd.Cita.AddAsync(entidad);
            await _bd.SaveChangesAsync();

            return entidad;
        }

        public async Task Actualizar(Citum entidad)
        {
            await _bd.SaveChangesAsync();
        }

        public async Task Eliminar(Citum entidad)
        {
            _bd.Cita.Remove(entidad);
            await _bd.SaveChangesAsync();
        }

        public async Task<bool> ExisteCliente(int clienteId)
        {
            return await _bd.Clientes
                .AnyAsync(p => p.ClienteId == clienteId);
        }

        public async Task<bool> ExisteEstilista(int estilistaId)
        {
            return await _bd.Estilista
                .AnyAsync(p => p.EstilistaId == estilistaId);
        }
    }
}