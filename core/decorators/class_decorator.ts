import { kPath } from "../constant"

export const RestController = (path?: string | string[]): ClassDecorator => {
  let nextPath = path ?? '/'
  if (!Array.isArray(nextPath)) nextPath = [nextPath]
  nextPath = nextPath.map(p => '/' + p.split('/').filter(e => !!e).join('/'))
  return (target: Function) => {
    Reflect.defineMetadata(kPath, nextPath, target)
  }
}
