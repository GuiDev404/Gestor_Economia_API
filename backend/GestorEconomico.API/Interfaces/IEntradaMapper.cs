using GestorEconomico.API.DTOs;
using GestorEconomico.API.Models;

namespace GestorEconomico.API.Interfaces {
  public interface IEntradaMapper
  {
    IEnumerable<EntradaDTO> Map(IEnumerable<Entrada> source);
    EntradaDTO Map(Entrada source);

    Entrada Map(EntradaCreateDTO dto);
    Entrada Map(EntradaUpdateDTO dto);
  }

}