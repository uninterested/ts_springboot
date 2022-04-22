declare type Primitive = string | boolean | number | null | undefined;
declare type Trivial = string | number | boolean;
declare type POJO<T = any> = {
  [p: string]: T
}
declare type POVO = {
  [p: string]: Primitive
}
declare type POTO = {
  [p: string]: Trivial
}
declare type POSO = {
  [p: string]: string
}
declare interface PIJO<T = any> {
  [x: number]: T;
}
declare interface PITO<T = Trivial> {
  [x: number]: T;
}
declare interface PISO {
  [x: number]: string;
}
declare interface PINO {
  [x: number]: number;
}

declare interface String {
  format(...args: (number | string) []): string
}

declare type TLanguage = 'ZHHANS' | 'ENGLISH'

declare type THttpRes<T = any> = {
  success: boolean
  message?: string
  code: number
  data?: T
}

declare type IPostResponse<T = any> = {
  page: number
  capacity: number
  total: number
  pageCount: number
  records: T
}

declare type Optional<T> = {
  [P in keyof T]?: T[P];
}

declare interface IPageWithReq<T> {
  capacity: number
  page: number
  model?: Optional<T>
  sorts?: IPageSortsModel[]
}

declare interface IPageSortsModel {
  property: string
  direction: 'desc' | 'asc'
}

declare interface IToastProps {
  duration?: number
  open: boolean,
  text?: string,
  status?: 'error' | 'loading' | 'success'
}