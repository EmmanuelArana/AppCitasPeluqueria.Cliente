using DTO.CitasPeluqueria.Request.Estilistum;
using DTO.CitasPeluqueria.Response.Estilistum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.CitasPeluqueria.Interfaces
{
    public interface IEstilistumNegocio
    {
        Task<List<EstilistumResponse>> Listar();
        Task<EstilistumResponse?> ObtenerPorId(int id);
        Task<EstilistumResponse> Crear(EstilistumRequest datos);
        Task<bool> Actualizar(int id, EstilistumRequest datos);
        Task<bool> Eliminar(int id);
    }
}
