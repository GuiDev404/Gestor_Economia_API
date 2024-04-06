import { authInstance } from ".";
import { Entrada, EntradaCreate, EntradaUpdate, EntradasResponse, ErrorResponse } from "../types";

interface SearchQueryParams {
  dateInit: string
  dateEnd: string
  isDesc?: string
  sortBy: 'FechaInicio' | 'string'
} 

export const getAllEntradas = ({
  dateInit,
  dateEnd,
  isDesc = "true",
  sortBy,
}: SearchQueryParams): Promise<EntradasResponse> =>
  authInstance
    .get(`/Entrada?DateInit=${dateInit}&DateEnd=${dateEnd}&IsDescending=${isDesc}&SortBy=${sortBy}`)
    .then((res) => res.data);

export const newEntrada = (entrada: EntradaCreate) =>
  authInstance.post<Entrada | ErrorResponse>(`/Entrada`, entrada)

export const removeEntrada = (entradaId: string) =>
  authInstance.delete<Entrada | ErrorResponse>(`/Entrada/${entradaId}`)

export const updateEntrada = ({ entradaId, data }: { entradaId: string, data: EntradaUpdate }) => 
  authInstance.put<Entrada>(`/Entrada/${entradaId}`, data);