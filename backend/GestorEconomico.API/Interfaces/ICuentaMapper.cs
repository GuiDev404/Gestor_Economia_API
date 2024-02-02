using GestorEconomico.API.DTOs;
using GestorEconomico.API.Models;

namespace GestorEconomico.API.Interfaces {
  public interface ICuentaMapper
  {
      IEnumerable<CuentaDTO> Map(IEnumerable<Cuenta> source);
      CuentaDTO Map(Cuenta source);
      Cuenta Map(CuentaDTO source);
      Cuenta Map(CuentaCreateDTO source);

      Cuenta Map(Cuenta result, CuentaUpdateDTO cuentaDTO);
  }

}