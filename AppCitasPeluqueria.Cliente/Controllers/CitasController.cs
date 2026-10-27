using Microsoft.AspNetCore.Mvc;

namespace PeluqueriaFrontEnd.Controllers
{
    public class CitasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Editar(int id)
        {
            return View();
        }
    }
}
