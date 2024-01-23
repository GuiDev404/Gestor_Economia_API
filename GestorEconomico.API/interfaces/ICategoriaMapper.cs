using GestorEconomico.DTOs;
using GestorEconomico.Models;

namespace GestorEconomico.interfaces {
  public interface ICategoriaMapper
  {
      IEnumerable<CategoriaDTO> Map(IEnumerable<Categoria> source);
      CategoriaDTO Map(Categoria source);
      Categoria Map(CategoriaDTO source);
      Categoria Map(CategoriaCreateDTO source);
  }

}