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
  cuentaId:        number;
  cuentaNombre:    string;
  file:            string;
  fileType:        string;
  filename:        string;
}
