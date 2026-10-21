using DTO.CitasPeluqueria.Response.Estilistum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.CitasPeluqueria.Interfaces
{
    public interface IEstilistumNegocio
    {
        Task<List<EstilistumResponse>> Listar();
    }
}
