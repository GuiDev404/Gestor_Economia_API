import { authInstance } from ".";
import { Cuentas } from "../types";

export const getAllCuentas = (): Promise<Cuentas[]> => authInstance.get(`/Cuenta`)
  .then(res=> res.data)
