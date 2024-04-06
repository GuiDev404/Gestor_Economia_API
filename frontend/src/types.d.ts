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
  usuarioID:     string;
  categoriaNombre: string;
  categoriaColor:  string;
  cuentaId:        number;
  cuentaNombre:    string;
  cuentaColor:     string;
  file:            string;
  fileType:        string;
  filename:        string;
}

export type EntradaCreate = Pick<
  Entrada,
  'descripcion' | 'categoriaId' | 'cuentaId' | 'fechaInicio' | 'file'
> 

export type EntradaUpdate = Omit<Entrada, 'usuarioID' | 'eliminada'> 

export interface Cuenta {
  cuentaId:    number;
  titulo:      string;
  descripcion: string;
  usuarioID:   string;
  color:       string;
  emoji:       string;
  eliminada:   boolean;
}

export type CuentaCreate = Pick<Cuenta, 'color' | 'descripcion' | 'emoji' | 'titulo'> 
export type CuentaUpdate = Omit<Cuenta, 'eliminada' | 'usuarioID'> 

export enum TiposEntradas {
  Egreso,
  Ingreso
}

export interface Categoria {
  categoriaId: number | string;
  nombre:      string;
  eliminada:   boolean;
  usuarioID:   string;
  tipoEntrada: string | TiposEntradas;
  color:       string;
  emoji:       string;
}

export type CategoriaCreate = Pick<Categoria, 'color' | 'emoji' | 'nombre' | 'tipoEntrada'>
export type CategoriaUpdate = Omit<Categoria, 'eliminada' | 'usuarioID'>

interface ErrorResponse {
  status: number;
  title: string;
}