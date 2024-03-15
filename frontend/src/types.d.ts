export type User = {
  rol: string | null
  userId: string | null
  accessToken: string | null
  refreshToken: string | null
} | null

export interface EntradasResponse {
  page:       number;
  nextPage:   number;
  limitPages: number;
  results:    Entrada[];
}

export interface Entrada {
  entradaId:       number;
  descripcion:     string;
  tiposEntrada:    number;
  monto:           number;
  fechaInicio:     Date;
  fechaFin?:       Date;
  eliminada:       boolean;
  categoriaId:     number;
  categoriaNombre: string;
  categoriaColor:  string;
  cuentaId:        number;
  cuentaNombre:    string;
  cuentaColor:     string;
  file:            string;
  fileType:        string;
  filename:        string;
}

export interface Cuentas {
  cuentaId:    number;
  titulo:      string;
  descripcion: string;
  usuarioID:   string;
  color:       string;
  emoji:       string;
  eliminada:   boolean;
}

export enum TiposEntradas
{
  Egreso,
  Ingreso
}

export interface Categoria {
  categoriaId: number;
  nombre:      string;
  eliminada:   boolean;
  usuarioID:   string;
  tipoEntrada: TiposEntradas;
  color:       string;
  emoji:       string;
}