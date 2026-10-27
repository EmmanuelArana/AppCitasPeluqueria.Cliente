using Entities.CitasPeluqueria;

namespace Repository.CitasPeluqueria.Interfaces
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> Listar();

        Task<Cliente?> ObtenerPorId(int id);

        Task<Cliente> Crear(Cliente entidad);

        Task Actualizar(Cliente entidad);

        Task Eliminar(Cliente entidad);

        Task<bool> TieneCitas(int clienteId);
    }
}