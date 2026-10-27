using DTO.CitasPeluqueria.Request.Especialidad;
using DTO.CitasPeluqueria.Response.Especialidad;

namespace Business.CitasPeluqueria.Interfaces
{
    public interface IEspecialidadNegocio
    {
        Task<List<EspecialidadResponse>> Listar();
        Task<EspecialidadResponse?> ObtenerPorId(int id);
        Task<EspecialidadResponse> Crear(EspecialidadRequest datos);
        Task<bool> Actualizar(int id, EspecialidadRequest datos);
        Task<bool> Eliminar(int id);
    }
}