using System.Collections.Generic;
using FakeItEasy;
using FluentAssertions;
using GestorEconomico.controllers;
using GestorEconomico.DTOs;
using GestorEconomico.interfaces;
using GestorEconomico.Mapper;
using GestorEconomico.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

// https://github.com/teddysmithdev/pokemon-review-api/blob/master/PokemonReviewApp.Tests/Controller/PokemonControllerTests.cs

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
        var result = await controller.GetCategoria("");

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
        A.CallTo(() => _categoriaRepository.GetCategorias("")).Returns(categorias);
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