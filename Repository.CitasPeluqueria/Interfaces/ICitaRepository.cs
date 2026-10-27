using Entities.CitasPeluqueria;

namespace Repository.CitasPeluqueria.Interfaces
{
    public interface ICitaRepository
    {
        Task<List<Citum>> Listar();

        Task<Citum?> ObtenerPorId(int id);

        Task<Citum> Crear(Citum entidad);

        Task Actualizar(Citum entidad);

        Task Eliminar(Citum entidad);

        Task<bool> ExisteCliente(int clienteId);

        Task<bool> ExisteEstilista(int estilistaId);
    }
}