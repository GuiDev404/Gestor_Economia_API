using System.Collections.Generic;
using FakeItEasy;
using FluentAssertions;
using GestorEconomico.API.Controllers;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace GestorEconomico.Test;

public class CategoriaControllerTest
{
    private readonly ICategoriaRepository _categoriaRepository;
    private readonly ICategoriaMapper _mapper;

    public CategoriaControllerTest()
    {
        _categoriaRepository = A.Fake<ICategoriaRepository>();
        _mapper = A.Fake<ICategoriaMapper>();
    }

    [Fact]
    public async void CategoriaController_GetCategorias_ReturnOk()
    {
        //Arrange
        var categorias = A.Fake<IEnumerable<Categoria>>();
        var categoriasList = A.Fake<IEnumerable<CategoriaDTO>>();
        A.CallTo(() => _mapper.Map(categorias)).Returns(categoriasList);

        var controller = new CategoriaController(_categoriaRepository, _mapper);
        
        //Act
        var result = await controller.GetCategorias(new QueryObject());

        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));

        // Si retornara ActionResult<IEnumerable<CategoriaDTO>>
        // result.Should().BeOfType(typeof(ActionResult<IEnumerable<CategoriaDTO>>));
    }

    [Fact]
    public async void CategoriaController_CreateCategoria_ReturnCreated(){
        // Arrange
        var categorias = A.Fake<IEnumerable<Categoria>>();
        var categoriaCreateDTO = A.Fake<CategoriaCreateDTO>();
        var categoria = A.Fake<Categoria>();
        var categoriaDTO = A.Fake<CategoriaDTO>();
        A.CallTo(() => _categoriaRepository.GetCategorias(new QueryObject {})).Returns(categorias);
        A.CallTo(() => _mapper.Map(categoriaCreateDTO)).Returns(categoria);
        A.CallTo(() => _categoriaRepository.CreateCategoria(categoria)).Returns(true);
        A.CallTo(() => _mapper.Map(categoria)).Returns(categoriaDTO);

        var controller = new CategoriaController(_categoriaRepository, _mapper);
        // Act
        var result = await controller.PostCategoria(categoriaCreateDTO);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(CreatedAtActionResult));
    }

}