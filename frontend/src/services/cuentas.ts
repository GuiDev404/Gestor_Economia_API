import { authInstance } from ".";
import { Cuenta } from "../types";

export const getAllCuentas = (): Promise<Cuenta[]> => authInstance.get(`/Cuenta`)
  .then(res=> res.data)
