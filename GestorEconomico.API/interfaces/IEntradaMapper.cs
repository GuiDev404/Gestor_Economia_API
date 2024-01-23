using GestorEconomico.API.DTOs;
using GestorEconomico.Intefaces;
using GestorEconomico.Models;

namespace GestorEconomico.interfaces {
  public interface IEntradaMapper
  {
    IEnumerable<EntradaDTO> Map(IEnumerable<Entrada> source);
    EntradaDTO Map(Entrada source);

    Entrada Map(EntradaCreateDTO dto);
    Entrada Map(EntradaUpdateDTO dto);
  }

}