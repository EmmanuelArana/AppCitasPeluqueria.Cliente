using Entities.CitasPeluqueria;
using Microsoft.EntityFrameworkCore;
using Repository.CitasPeluqueria.Implementaciones;
using Repository.CitasPeluqueria.Interfaces;
using Business.CitasPeluqueria.Interfaces;
using Business.CitasPeluqueria.Implementaciones;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CitasPeluqueriaContext>(opt =>
{
    opt.UseSqlServer(
        builder.Configuration.GetConnectionString("CitasPeluqueriaDB"));
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMvc", policy =>
    {
        policy.WithOrigins("http://localhost:5159")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


//Repositorio
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ICitaRepository, CitaRepository>();

builder.Services.AddScoped<IEstilistumRepository, EstilistumRepository>();
builder.Services.AddScoped<IEspecialidadRepository, EspecialidadRepository>();
//Negocio
builder.Services.AddScoped<IClienteNegocio, ClienteNegocio>();
builder.Services.AddScoped<ICitaNegocio, CitaNegocio>();

builder.Services.AddScoped<IEspecialidadNegocio, EspecialidadNegocio>();
builder.Services.AddScoped<IEstilistumNegocio, EstilistumNegocio>();


//swagger
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowMvc");

app.UseAuthorization();

app.MapControllers();

app.Run();