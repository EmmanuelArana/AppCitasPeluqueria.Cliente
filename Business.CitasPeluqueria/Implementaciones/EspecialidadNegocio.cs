using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Response.Especialidad;
using Repository.CitasPeluqueria.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.CitasPeluqueria.Implementaciones;

public class EspecialidadNegocio : IEspecialidadNegocio
{
    private readonly IEspecialidadRepository _repositorio;
    public EspecialidadNegocio(IEspecialidadRepository repositorio)
    {
        _repositorio = repositorio;
    }
    public async Task<List<EspecialidadResponse>> Listar()
    {
        var lista = await _repositorio.Listar();
        return lista.Select(p => new EspecialidadResponse
        {
            Nombre = p.Nombre,
           EspecialidadId = p.EspecialidadId
        }).ToList();
    }
}