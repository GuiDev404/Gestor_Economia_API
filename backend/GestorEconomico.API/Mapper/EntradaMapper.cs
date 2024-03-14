using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Mapper
{
    public class EntradaMapper : IEntradaMapper {    
        private EntradaDTO EntradaToEntradaDTO (Entrada entrada){
            return new EntradaDTO {
                EntradaId = entrada.EntradaId,
                Descripcion = entrada.Descripcion,
                TiposEntrada = entrada.TiposEntrada,
                FechaInicio = entrada.FechaInicio,
                FechaFin = entrada.FechaFin,
                Monto = entrada.Monto,
                File = entrada.File,
                Filename = entrada.Filename,
                FileType = entrada.FileType,
                Eliminada = entrada.Eliminada,
                CategoriaId = entrada.CategoriaId,
                CuentaId = entrada.CuentaId,
                CuentaNombre = entrada?.Cuenta?.Descripcion,
                CategoriaNombre = entrada?.Categoria.Nombre,
            };
        }
    
        public IEnumerable<EntradaDTO> Map(IEnumerable<Entrada> source)=>  source.Select(EntradaToEntradaDTO);

        public EntradaDTO Map(Entrada source) => EntradaToEntradaDTO(source);

        private Entrada DtoToEntrada (EntradaCreateDTO dto){
            var (archivoBinario, fileType, filename) = ConvertFormFile
                .FormFileToBinary(dto.Comprobante, Const.MIME_TYPES);

            return new Entrada {
                CategoriaId = dto.CategoriaId,
                CuentaId = dto.CuentaId,
                Descripcion = dto.Descripcion,
                Monto = dto.Monto,
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin,
                TiposEntrada = dto.Monto > 0 ? TiposEntradas.Ingreso : TiposEntradas.Egreso,
                File = archivoBinario,
                Filename = filename,
                FileType = fileType,
                UsuarioID = "", // CAMBIARLO AL OBTENER EL USUARIO ACTUAL
            };
        }

        public Entrada Map(EntradaCreateDTO dto)=> DtoToEntrada(dto);

        public Entrada Map(EntradaUpdateDTO dto)
        {
            Entrada entradaUpdated = DtoToEntrada(dto);
            entradaUpdated.EntradaId = dto.EntradaId;
            return entradaUpdated;
        }
    }

}