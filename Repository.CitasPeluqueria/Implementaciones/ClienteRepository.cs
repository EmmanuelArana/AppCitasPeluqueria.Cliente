using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Interfaces;

namespace Repository.CitasPeluqueria.Implementaciones
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly CitasPeluqueriaContext _bd;

        public ClienteRepository(CitasPeluqueriaContext bd)
        {
            _bd = bd;
        }

        public async Task<List<Cliente>> Listar()
        {
            return await _bd.Clientes
                .OrderBy(p => p.ClienteId)
                .ToListAsync();
        }

        public async Task<Cliente?> ObtenerPorId(int id)
        {
            return await _bd.Clientes
                .FirstOrDefaultAsync(p => p.ClienteId == id);
        }

        public async Task<Cliente> Crear(Cliente entidad)
        {
            await _bd.Clientes.AddAsync(entidad);
            await _bd.SaveChangesAsync();

            return entidad;
        }

        public async Task Actualizar(Cliente entidad)
        {
            await _bd.SaveChangesAsync();
        }

        public async Task Eliminar(Cliente entidad)
        {
            _bd.Clientes.Remove(entidad);
            await _bd.SaveChangesAsync();
        }

        public async Task<bool> TieneCitas(int clienteId)
        {
            return await _bd.Cita
                .AnyAsync(p => p.ClienteId == clienteId);
        }
    }
}