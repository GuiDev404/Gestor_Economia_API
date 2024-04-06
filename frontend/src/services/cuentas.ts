import { ErrorResponse } from "react-router-dom";
import { authInstance } from ".";
import { Cuenta, CuentaCreate, CuentaUpdate } from "../types";

export const getAllCuentas = (): Promise<Cuenta[]> => authInstance.get(`/Cuenta`)
  .then(res=> res.data)

export const newCuenta = (cuenta: CuentaCreate) =>
  authInstance.post<Cuenta | ErrorResponse>(`/Cuenta`, cuenta)

export const removeCuenta = (cuentaId: string) =>
  authInstance.delete<Cuenta | ErrorResponse>(`/Cuenta/${cuentaId}`)

export const updateCuenta = ({ cuentaId, data }: { cuentaId: string, data: CuentaUpdate }) => 
  authInstance.put<Cuenta>(`/Cuenta/${cuentaId}`, data);