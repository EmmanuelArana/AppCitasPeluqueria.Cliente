using DTO.CitasPeluqueria.Request.Cita;
using DTO.CitasPeluqueria.Response.Cita;

namespace Business.CitasPeluqueria.Interfaces
{
    public interface ICitaNegocio
    {
        Task<List<CitaResponse>> Listar();

        Task<CitaResponse?> ObtenerPorId(int id);

        Task<CitaResponse> Crear(CitaRequest datos);

        Task<bool> Actualizar(int id, CitaRequest datos);

        Task<bool> Eliminar(int id);
    }
}