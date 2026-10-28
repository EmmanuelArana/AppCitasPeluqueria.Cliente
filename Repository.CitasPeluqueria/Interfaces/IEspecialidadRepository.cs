using Entities.CitasPeluqueria;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository.CitasPeluqueria.Interfaces
{
    public interface IEspecialidadRepository
    {
        Task<List<Especialidad>> Listar();
        Task<Especialidad?> ObtenerPorId(int id);
        Task<Especialidad> Crear(Especialidad entidad);
        Task Actualizar(Especialidad entidad);
        Task<bool> ExisteNombre(string nombre, int? excluirId = null);
        Task<bool> TieneEstilistasActivos(int especialidadId);
        Task Eliminar(Especialidad entidad);
    }
}
