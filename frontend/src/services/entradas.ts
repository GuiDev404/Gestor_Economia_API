import { authInstance } from ".";
import { EntradasResponse } from "../types";

export const getAllEntradas = (): Promise<EntradasResponse> => authInstance.get(`/Entrada`)
  .then(res=> res.data)
