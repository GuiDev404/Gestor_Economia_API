using GestorEconomico.API.DTOs;
using GestorEconomico.Intefaces;
using GestorEconomico.interfaces;
using GestorEconomico.Models;
using GestorEconomico.Utils;
using PromiedosAPI.Helpers;
using Riok.Mapperly.Abstractions;

namespace GestorEconomico.Mapper
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
                CategoriaNombre = entrada.Categoria.Nombre,
            };
        }
    
        public IEnumerable<EntradaDTO> Map(IEnumerable<Entrada> source)=>  source.Select(EntradaToEntradaDTO);

        public EntradaDTO Map(Entrada source) => EntradaToEntradaDTO(source);

        private Entrada DtoToEntrada (EntradaCreateDTO dto){
            var (archivoBinario, fileType, filename) = ConvertFormFile
                .FormFileToBinary(dto.Comprobante, Const.MIME_TYPES);

            return new Entrada {
                CategoriaId = dto.CategoriaId,
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