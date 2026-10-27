using Business.CitasPeluqueria.Interfaces;
using DTO.CitasPeluqueria.Request.Cliente;
using DTO.CitasPeluqueria.Response.Cliente;
using Entities.CitasPeluqueria;
using Repository.CitasPeluqueria.Interfaces;

namespace Business.CitasPeluqueria.Implementaciones
{
    public class ClienteNegocio : IClienteNegocio
    {
        private readonly IClienteRepository _repositorio;

        public ClienteNegocio(IClienteRepository repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<ClienteResponse>> Listar()
        {
            var lista = await _repositorio.Listar();

            return lista.Select(p => Convertir(p)).ToList();
        }

        public async Task<ClienteResponse?> ObtenerPorId(int id)
        {
            var cliente = await _repositorio.ObtenerPorId(id);

            return cliente == null ? null : Convertir(cliente);
        }

        public async Task<ClienteResponse> Crear(ClienteRequest datos)
        {
            Validar(datos);

            var cliente = new Cliente
            {
                Nombre = datos.Nombre.Trim(),
                Telefono = datos.Telefono,
                Email = datos.Email,
                Activo = datos.Activo,
                FechaCreacion = DateTime.UtcNow
            };

            await _repositorio.Crear(cliente);

            return Convertir(cliente);
        }

        public async Task<bool> Actualizar(int id, ClienteRequest datos)
        {
            var cliente = await _repositorio.ObtenerPorId(id);

            if (cliente == null)
                return false;

            Validar(datos);

            cliente.Nombre = datos.Nombre.Trim();
            cliente.Telefono = datos.Telefono;
            cliente.Email = datos.Email;
            cliente.Activo = datos.Activo;

            await _repositorio.Actualizar(cliente);

            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            var cliente = await _repositorio.ObtenerPorId(id);

            if (cliente == null)
                return false;

            if (await _repositorio.TieneCitas(id))
                throw new ArgumentException(
                    "No se puede eliminar el cliente porque tiene citas registradas.");

            await _repositorio.Eliminar(cliente);

            return true;
        }

        private static void Validar(ClienteRequest datos)
        {
            if (string.IsNullOrWhiteSpace(datos.Nombre))
                throw new ArgumentException("El nombre es obligatorio.");
        }

        private static ClienteResponse Convertir(Cliente cliente)
        {
            return new ClienteResponse
            {
                ClienteId = cliente.ClienteId,
                Nombre = cliente.Nombre,
                Telefono = cliente.Telefono,
                Email = cliente.Email,
                Activo = cliente.Activo,
                FechaCreacion = cliente.FechaCreacion
            };
        }
    }
}