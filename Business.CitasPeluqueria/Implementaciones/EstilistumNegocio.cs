using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Estilistum;
using DTO.CitasPeluqueria.Response.Estilistum;
using Entities.CitasPeluqueria;
using Repository.CitasPeluqueria.Interfaces;

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
            return lista.Select(p => Convertir(p)).ToList();
        }

        public async Task<EstilistumResponse?> ObtenerPorId(int id)
        {
            var estilista = await _repositorio.ObtenerPorId(id);
            return estilista == null ? null : Convertir(estilista);
        }

        public async Task<EstilistumResponse> Crear(EstilistumRequest datos)
        {
            await Validar(datos);

            var estilista = new Estilistum
            {
                Nombre = datos.Nombre.Trim(),
                EspecialidadId = datos.EspecialidadId,
                Telefono = datos.Telefono,
                Email = datos.Email,
                Activo = true,
                FechaCreacion = DateTime.UtcNow
            };

            await _repositorio.Crear(estilista);

            // Recargar para traer la Especialidad incluida
            var registrado = await _repositorio.ObtenerPorId(estilista.EstilistaId);

            return Convertir(registrado!);
        }

        public async Task<bool> Actualizar(int id, EstilistumRequest datos)
        {
            var estilista = await _repositorio.ObtenerPorId(id);

            if (estilista == null)
                return false;

            await Validar(datos);

            // Solo se valida cuando pasa de activo a inactivo
            if (estilista.Activo && !datos.Activo
                && await _repositorio.TieneCitasPendientes(id))
            {
                throw new ArgumentException("No se puede desactivar al estilista porque tiene citas pendientes.");
            }

            estilista.Nombre = datos.Nombre.Trim();
            estilista.EspecialidadId = datos.EspecialidadId;
            estilista.Telefono = datos.Telefono;
            estilista.Email = datos.Email;
            estilista.Activo = datos.Activo;

            await _repositorio.Actualizar(estilista);

            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var estilista = await _repositorio.ObtenerPorId(id);

            if (estilista == null)
                return false;

            if (await _repositorio.TieneCitas(id))
                throw new ArgumentException("No se puede eliminar el estilista porque tiene citas registradas.");

            await _repositorio.Eliminar(estilista); // hard delete

            return true;
        }

        private async Task Validar(EstilistumRequest datos)
        {
            if (string.IsNullOrWhiteSpace(datos.Nombre))
                throw new ArgumentException("Debe indicar el nombre del estilista.");

            if (!await _repositorio.ExisteEspecialidad(datos.EspecialidadId))
                throw new ArgumentException("La especialidad indicada no existe o está inactiva.");
        }

        private static EstilistumResponse Convertir(Estilistum estilista)
        {
            return new EstilistumResponse
            {
                EstilistaId = estilista.EstilistaId,
                Nombre = estilista.Nombre,
                EspecialidadId = estilista.EspecialidadId,
                Telefono = estilista.Telefono,
                Email = estilista.Email,
                Activo = estilista.Activo,
                FechaCreacion = estilista.FechaCreacion,
                Especialidad = estilista.Especialidad == null ? null : new EspecialidadDto
                {
                    EspecialidadId = estilista.Especialidad.EspecialidadId,
                    Nombre = estilista.Especialidad.Nombre
                },
                Citas = estilista.Cita.Select(c => new CitaDto
                {
                    CitaId = c.CitaId,
                    FechaCita = c.FechaCita,
                    HoraCita = c.HoraCita,
                    Estado = c.Estado
                }).ToList()
            };
        }
    }
}