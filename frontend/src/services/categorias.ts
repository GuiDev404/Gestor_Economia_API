import { AxiosError } from "axios";
import { authInstance } from ".";
import { Categoria, CategoriaCreate, CategoriaUpdate, ErrorResponse } from "../types";

export const getAllCategorias = (): Promise<Categoria[]> =>
  authInstance.get(`/Categoria`).then((res) => res.data);

export const newCategoria = (data: CategoriaCreate) =>
  authInstance.post<Categoria | ErrorResponse>(`/Categoria`, data)
  // .then(response=> {
  //   if(response instanceof AxiosError){
  //     const errorData = response.data as ErrorResponse  
  //     throw new Error(errorData.status === 409 ? errorData.title : 'Algo salio mal!')
  //   }

  //   return response
  // })

export const removeCategoria = (categoriaId: string) =>
  authInstance.delete(`/Categoria/${categoriaId}`);

export const updateCategoria = ({ categoriaId, data }: { categoriaId: string, data: CategoriaUpdate }) =>
  authInstance.put<Categoria>(`/Categoria/${categoriaId}`, data);
