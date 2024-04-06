import { z } from "zod";

export const cuentaFormSchema = z.object({
  id: z
    .string()
    .default(''),
  color: z
    .string({ required_error: "El color para la categoria es requerido" })
    .min(1, 'El color para la categoria es requerido'),
  titulo: z
    .string()
    .min(1, "El titulo de la cuenta es requerido")
    .max(30, 'Debe tener menos de 30 caracteres'),
  descripcion: z
    .string()
    .min(1, "La descripción de la cuenta es requerida")
    .max(60, 'Debe tener menos de 60 caracteres'),
  emoji: z
    .string({ required_error: 'El emoji es requerido' })
});

export type CuentaFormSchemaType = z.infer<typeof cuentaFormSchema>;

export type KeysFormSchema = keyof CuentaFormSchemaType
export type ErrorKeysFormSchema = keyof CuentaFormSchemaType | 'root' | `root.${string}`