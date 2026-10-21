using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Response.Especialidad;
using DTO.CitasPeluqueria.Response.Estilistum;
using Repository.CitasPeluqueria.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.CitasPeluqueria.Implementaciones
{
    public class EstilistumNegocio : IEstilistumNegocio
    {
        private readonly IEstilistumRepository _repositorio;
        public EstilistumNegocio(IEstilistumRepository repositorio)
        {
            _repositorio = repositorio;
        }
        public async Task<List<EstilistumResponse>> Listar()
        {
            var lista = await _repositorio.Listar();
            return lista.Select(p => new EstilistumResponse
            {
                Nombre = p.Nombre,
                EstilistaId = p.EstilistaId,
                EspecialidadId = p.EspecialidadId,
                Telefono = p.Telefono,
                Email = p.Email

            }).ToList();
        }
    }
}
