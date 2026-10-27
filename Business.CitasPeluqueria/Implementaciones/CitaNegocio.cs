using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Cita;
using DTO.CitasPeluqueria.Response.Cita;
using Entities.CitasPeluqueria;
using Repository.CitasPeluqueria.Interfaces;

namespace Business.CitasPeluqueria.Implementaciones
{
    public class CitaNegocio : ICitaNegocio
    {
        private readonly ICitaRepository _repositorio;

        public CitaNegocio(ICitaRepository repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<CitaResponse>> Listar()
        {
            var lista = await _repositorio.Listar();

            return lista.Select(p => Convertir(p)).ToList();
        }

        public async Task<CitaResponse?> ObtenerPorId(int id)
        {
            var cita = await _repositorio.ObtenerPorId(id);

            return cita == null ? null : Convertir(cita);
        }

        public async Task<CitaResponse> Crear(CitaRequest datos)
        {
            await Validar(datos);

            var cita = new Citum
            {
                ClienteId = datos.ClienteId,
                EstilistaId = datos.EstilistaId,
                FechaCita = datos.FechaCita!.Value,
                HoraCita = datos.HoraCita!.Value,
                Notas = datos.Notas,
                Estado = datos.Estado,
                FechaCreacion = DateTime.UtcNow
            };

            await _repositorio.Crear(cita);

            var registrada = await _repositorio.ObtenerPorId(cita.CitaId);

            return Convertir(registrada!);
        }

        public async Task<bool> Actualizar(int id, CitaRequest datos)
        {
            var cita = await _repositorio.ObtenerPorId(id);

            if (cita == null)
                return false;

            await Validar(datos);

            cita.ClienteId = datos.ClienteId;
            cita.EstilistaId = datos.EstilistaId;
            cita.FechaCita = datos.FechaCita!.Value;
            cita.HoraCita = datos.HoraCita!.Value;
            cita.Notas = datos.Notas;
            cita.Estado = datos.Estado;

            await _repositorio.Actualizar(cita);

            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var cita = await _repositorio.ObtenerPorId(id);

            if (cita == null)
                return false;

            await _repositorio.Eliminar(cita);

            return true;
        }

        private async Task Validar(CitaRequest datos)
        {
            if (!datos.FechaCita.HasValue ||
                datos.FechaCita.Value == DateOnly.MinValue)
            {
                throw new ArgumentException(
                    "Debe indicar una fecha válida.");
            }

            if (!datos.HoraCita.HasValue)
            {
                throw new ArgumentException(
                    "Debe indicar la hora de la cita.");
            }

            if (!await _repositorio.ExisteCliente(datos.ClienteId))
            {
                throw new ArgumentException(
                    "El cliente indicado no existe.");
            }

            if (!await _repositorio.ExisteEstilista(datos.EstilistaId))
            {
                throw new ArgumentException(
                    "El estilista indicado no existe.");
            }
        }

        private static CitaResponse Convertir(Citum cita)
        {
            return new CitaResponse
            {
                CitaId = cita.CitaId,
                ClienteId = cita.ClienteId,
                Cliente = cita.Cliente.Nombre,
                EstilistaId = cita.EstilistaId,
                Estilista = cita.Estilista.Nombre,
                FechaCita = cita.FechaCita,
                HoraCita = cita.HoraCita,
                Notas = cita.Notas,
                Estado = cita.Estado,
                FechaCreacion = cita.FechaCreacion
            };
        }
    }
}