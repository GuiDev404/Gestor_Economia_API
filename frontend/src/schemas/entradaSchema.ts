import { z } from "zod";
import { TiposEntradas } from "../types.d";

export const entradaFormSchema = z.object({
  id: z
    .string()
    .default(''),
  descripcion: z
    .string({ required_error: "La descripcion para la entrada es requerida" })
    .min(1, 'La descripcion para la entrada es requerida'),
  monto: z
    .number({ required_error: "El monto de la entrada es requerido", coerce: true })
    .refine((monto: number)=> monto !== 0, 'Ingrese un monto distinto a cero'),
  fechaInicio: z
    .date({ 
      required_error: 'Ingrese la fecha de ocurrencia de la entrada',
      invalid_type_error: 'Ingrese una fecha valida',
      coerce: true
    }),
  categoriaId: z
    .string({ 
      invalid_type_error: 'Seleccione una categoria valida',
      required_error: 'Seleccione una categoria'
    })
    .min(1, 'Seleccione una categoria'),
  cuentaId: z
    .string({ invalid_type_error: 'Seleccione una categoria valida', required_error: 'Seleccione una cuenta' })
    .min(1, 'Seleccione una cuenta'),
  comprobante: z
    .instanceof(FileList)
    .refine((filelist: FileList)=> {
      if(filelist.length > 0){

        const MIME_TYPES = [
          "image/jpeg",
          "image/png",
          "image/tiff",
          "application/pdf",
          "application/zip",
          "text/plain",
          "text/csv"
        ]

        const firstFile = filelist.item(0)
        console.log(firstFile, firstFile !== null, firstFile?.type);

        if(firstFile !== null){
          return MIME_TYPES.includes(firstFile.type)
        } 

        return true
      }

      return true
    }, { message: 'Seleccione una imagen valida' })
    .optional()
    .or(z.null())
    // .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
});

export type EntradaFormSchemaType = z.infer<typeof entradaFormSchema>;
