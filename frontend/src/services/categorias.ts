import { authInstance } from ".";
import { Categoria } from "../types";

export const getAllCategorias = (): Promise<Categoria[]> => authInstance.get(`/Categoria`)
  .then(res=> res.data)
