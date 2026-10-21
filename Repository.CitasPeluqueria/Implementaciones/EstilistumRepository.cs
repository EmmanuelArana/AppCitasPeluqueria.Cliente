using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository.CitasPeluqueria.Implementaciones
{
    public class EstilistumRepository : IEstilistumRepository
    {
        private readonly CitasPeluqueriaContext _bd;
        public EstilistumRepository(CitasPeluqueriaContext bd)
        {
            _bd = bd;
        }
        // async permite utilizar await dentro del método,await permite esperar a que una tarea asincrónica 
        public async Task<List<Estilistum>> Listar()// Task<List indica que el metodo devolvera una lista de modelos de manera asincrona
        {
            return await _bd.Estilista.Where(p => p.Activo == true).ToListAsync();
        }
    }
}
