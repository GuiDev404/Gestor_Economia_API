using GestorEconomico.API.DTOs;
using GestorEconomico.API.Models;

namespace GestorEconomico.API.Interfaces {
  public interface ICategoriaMapper
  {
      IEnumerable<CategoriaDTO> Map(IEnumerable<Categoria> source);
      CategoriaDTO Map(Categoria source);
      Categoria Map(CategoriaDTO source);
      Categoria Map(CategoriaCreateDTO source);
  }

}