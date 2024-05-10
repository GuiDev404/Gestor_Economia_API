import { z } from "zod";
import { TiposEntradas } from "../types.d";

export const categoriaCreateSchema = z.object({
  id: z
    .string()
    .default(''),
  color: z
    .string({ required_error: "El color para la categoria es requerido" })
    .min(1, 'El color para la categoria es requerido'),
  nombre: z
    .string()
    .min(1, "El nombre de la cateogira es requerido")
    .max(60, 'Debe tener menos de 60 caracteres'),
  tipoEntrada: z
    .number({ required_error: 'El tipo de entrada es requerido', coerce: true })
    .refine((tipo_entrada: number)=> {
      const TiposEntradasEnum = z.nativeEnum(TiposEntradas);
 
      // const tipo_entrada_number = parseInt(tipo_entrada, 10);
      const result = TiposEntradasEnum.safeParse(tipo_entrada);
 
      return result.success
    }, 'Seleccione un tipo de entrada valido'),
  emoji: z
    .string({ required_error: 'El emoji es requerido' })
    // .max(1, 'Solo puede seleccionar un emoji')
    // .refine(v=> {
    //   console.log({ v, long: v.length });
    //   return true
    // })
});

export type CategoriaCreateSchemaType = z.infer<typeof categoriaCreateSchema>;
