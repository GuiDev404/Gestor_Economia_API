import { normalInstance } from ".";
import { type LoginSchemaType } from "../schemas/authSchema";
import { User } from "../types";

export function loginService(loginData: LoginSchemaType): Promise<User> {
  return normalInstance
    .post("/Auth/Login", {
      Correo: loginData.email,
      Contraseña: loginData.password,
    })
    .then((response) => response.data);
}
