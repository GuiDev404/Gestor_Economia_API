using System.Collections.Generic;
using FakeItEasy;
using FluentAssertions;
using GestorEconomico.API.Controllers;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace GestorEconomico.Test;

public class EntradaControllerTest
{
    private readonly IEntradaRepository _entradaRepository;
    private readonly IEntradaMapper _mapper;

    public EntradaControllerTest()
    {
        _entradaRepository = A.Fake<IEntradaRepository>();
        _mapper = A.Fake<IEntradaMapper>();
    }

    [Fact]
    public async void  EntradaController_GetEntradas_ReturnOk()
    {
        //Arrange
       
        //Act
   
        //Assert
    }

    [Fact]
    public async void  EntradaController_CreateEntrada_ReturnOk(){
        // Arrange

        // Act

        // Assert
    }

}