using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using GestorEconomico.Mapper;
using GestorEconomico.Data;
using GestorEconomico.interfaces;
using GestorEconomico.repository;
using GestorEconomico.API.repository;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>{
    options.UseSqlServer(connectionString);
});

builder.Services.AddScoped<IEntradaRepository, EntradaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();

builder.Services.AddSingleton<ICategoriaMapper, CategoriaMapper>();
builder.Services.AddSingleton<IEntradaMapper, EntradaMapper>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
