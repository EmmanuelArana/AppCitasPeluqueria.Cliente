using DTO.CitasPeluqueria.Request.Cliente;
using DTO.CitasPeluqueria.Response.Cliente;

namespace Business.CitasPeluqueria.Interfaces
{
    public interface IClienteNegocio
    {
        Task<List<ClienteResponse>> Listar();

        Task<ClienteResponse?> ObtenerPorId(int id);

        Task<ClienteResponse> Crear(ClienteRequest datos);

        Task<bool> Actualizar(int id, ClienteRequest datos);

        Task<bool> Eliminar(int id);
    }
}