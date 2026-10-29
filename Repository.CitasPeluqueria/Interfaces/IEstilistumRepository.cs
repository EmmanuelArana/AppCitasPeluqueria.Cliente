using Entities.CitasPeluqueria;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository.CitasPeluqueria.Interfaces
{
    public interface IEstilistumRepository
    {
        Task<List<Estilistum>> Listar();
        Task<Estilistum?> ObtenerPorId(int id);
        Task<Estilistum> Crear(Estilistum entidad);
        Task Actualizar(Estilistum entidad);
        Task<bool> TieneCitas(int estilistaId);
        Task<bool> TieneCitasPendientes(int estilistaId);
        Task Eliminar(Estilistum entidad);
        Task<bool> ExisteEspecialidad(int especialidadId);
    }
}