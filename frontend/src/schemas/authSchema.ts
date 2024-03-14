import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Correo electronico requerido" })
    .email({ message: "Ingrese un correo electronico valido" }),
  password: z
    .string({ required_error: 'Ingrese una contraseña' })
    .min(3, "La contraseña debe tener como minimo 3 caracteres")
    .max(20, "La contraseña debe tener menos de 20 caracteres"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
