using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Especialidad;
using DTO.CitasPeluqueria.Response.Especialidad;
using Entities.CitasPeluqueria;
using Repository.CitasPeluqueria.Interfaces;

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
        return lista.Select(p => Convertir(p)).ToList();
    }

    public async Task<EspecialidadResponse?> ObtenerPorId(int id)
    {
        var especialidad = await _repositorio.ObtenerPorId(id);
        return especialidad == null ? null : Convertir(especialidad);
    }

    public async Task<EspecialidadResponse> Crear(EspecialidadRequest datos)
    {
        var nombre = datos.Nombre.Trim();

        if (string.IsNullOrWhiteSpace(nombre))
            throw new ArgumentException("Debe indicar el nombre de la especialidad.");

        if (await _repositorio.ExisteNombre(nombre))
            throw new ArgumentException("Ya existe una especialidad con ese nombre.");

        var especialidad = new Especialidad
        {
            Nombre = nombre,
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };

        await _repositorio.Crear(especialidad);

        return Convertir(especialidad);
    }

    public async Task<bool> Actualizar(int id, EspecialidadRequest datos)
    {
        var especialidad = await _repositorio.ObtenerPorId(id);

        if (especialidad == null)
            return false;

        var nombre = datos.Nombre.Trim();

        if (string.IsNullOrWhiteSpace(nombre))
            throw new ArgumentException("Debe indicar el nombre de la especialidad.");

        if (await _repositorio.ExisteNombre(nombre, id))
            throw new ArgumentException("Ya existe una especialidad con ese nombre.");

        if (!datos.Activo && await _repositorio.TieneEstilistasActivos(id))
            throw new ArgumentException("No se puede desactivar: hay estilistas activos con esta especialidad.");

        especialidad.Nombre = nombre;
        especialidad.Activo = datos.Activo;

        await _repositorio.Actualizar(especialidad);

        return true;
    }


    public async Task<bool> Eliminar(int id)
    {
        var especialidad = await _repositorio.ObtenerPorId(id);

        if (especialidad == null)
            return false;

        if (await _repositorio.TieneEstilistasActivos(id))
            throw new InvalidOperationException("No se puede eliminar la especialidad porque tiene estilistas asociados.");

        await _repositorio.Eliminar(especialidad); 

        return true;
    }

    private static EspecialidadResponse Convertir(Especialidad especialidad)
    {
        return new EspecialidadResponse
        {
            EspecialidadId = especialidad.EspecialidadId,
            Nombre = especialidad.Nombre,
            Activo = especialidad.Activo,
            FechaCreacion = especialidad.FechaCreacion
        };
    }
}