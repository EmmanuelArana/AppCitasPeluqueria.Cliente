using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Implementaciones;
using Repository.CitasPeluqueria.Interfaces;

using Business.CitasPeluqueria.Interfaces;
using Business.CitasPeluqueria.Implementaciones;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddDbContext<CitasPeluqueriaContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("CitasPeluqueriaDB"));
});


builder.Services.AddScoped<IEstilistumRepository, EstilistumRepository>();
builder.Services.AddScoped<IEspecialidadRepository, EspecialidadRepository>();



builder.Services.AddScoped<IEspecialidadNegocio, EspecialidadNegocio>();
builder.Services.AddScoped<IEstilistumNegocio, EstilistumNegocio>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
