import { kConfiguration, kControllerAdvice, kPath } from "../constant"

export const RestController = (path?: string | string[]): ClassDecorator => {
  let nextPath = path ?? '/'
  if (!Array.isArray(nextPath)) nextPath = [nextPath]
  nextPath = nextPath.map(p => '/' + p.split('/').filter(e => !!e).join('/'))
  return (target: Function) => {
    Reflect.defineMetadata(kPath, nextPath, target)
  }
}

export const Configuration: ClassDecorator = (target: Function) => {
  Reflect.defineMetadata(kConfiguration, true, target)
}

export const ControllerAdvice: ClassDecorator = (target: Function) => {
  Reflect.defineMetadata(kControllerAdvice, true, target)
}