import { kApiMethod, kExceptionHandler, kHeaders, kMethod, kPath } from "../constant"

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS'
}


export const GET = (path?: string | string[]): MethodDecorator => {
  return REQUEST(path ?? '/', HttpMethod.GET)
}

export const POST = (path?: string | string[]): MethodDecorator => {
  return REQUEST(path ?? '/', HttpMethod.POST)
}

export const PUT = (path?: string | string[]): MethodDecorator => {
  return REQUEST(path ?? '/', HttpMethod.PUT)
}

export const DELETE = (path?: string | string[]): MethodDecorator => {
  return REQUEST(path ?? '/', HttpMethod.DELETE)
}

export const PATCH = (path?: string | string[]): MethodDecorator => {
  return REQUEST(path ?? '/', HttpMethod.PATCH)
}

export const RequestMapping = (path?: string, method?: HttpMethod | HttpMethod[]) => {
  return REQUEST(path ?? '/', method ?? HttpMethod.GET)
}

export const Header = (opts?: {[k: string]: string | number | Date}): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(kHeaders, opts, descriptor.value)
  }
}

export const ExceptionHandler = (exceptionName: string): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(kExceptionHandler, exceptionName, descriptor.value)
    const methods = Reflect.getMetadata(kMethod, target) || {}
    methods[propertyKey] = true
    Reflect.defineMetadata(kMethod, methods, target)
  }
}

const REQUEST = (path: string | string[], method: HttpMethod | HttpMethod[]): MethodDecorator => {
  let nextPath = path
  if (!Array.isArray(nextPath)) nextPath = [nextPath]
  nextPath = nextPath.map(p => '/' + p.split('/').filter(e => !!e).join('/'))
  let nextMethod = Array.isArray(method) ? method : [method]
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(kPath, nextPath, descriptor.value)
    Reflect.defineMetadata(kApiMethod, nextMethod, descriptor.value)
    const methods = Reflect.getMetadata(kMethod, target) || {}
    methods[propertyKey] = true
    Reflect.defineMetadata(kMethod, methods, target)
  }
}