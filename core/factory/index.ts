import { pathToRegexp } from 'path-to-regexp'
import { kApiMethod, kMethod, kPath } from "../constant";
import { HttpMethod } from "../decorators";
import Svr, { IPoolProps } from "./svr";


export default class Factory {
  private pool: IPoolProps[] = []

  create(module: Function) {
    this.builder(module)
    return new Svr(this.pool)
  }

  private builder(module: Function) {
    this.clean()
    const controllers = Reflect.getMetadata('controllers', module) as (typeof Function)[]
    if (controllers.length <= 0) throw new Error('no controller found')
    const cache = []
    controllers.forEach(Fn => {
      const basePaths = Reflect.getMetadata(kPath, Fn)
      const instance = new Fn()
      const methods = Reflect.getMetadata(kMethod, instance)
      Object.keys(methods).forEach(method => {
        const fn = instance[method]
        const paths = Reflect.getMetadata(kPath, fn) as string[]
        const apiMethods = Reflect.getMetadata(kApiMethod, fn) as HttpMethod[]
        cache.push(this.buildOne(basePaths, paths, apiMethods, fn, instance))
      })
    })
    this.pool = cache.flat(Infinity)
  }

  private buildOne(base: string[], target: string[], apiMethods: HttpMethod[], fn: Function, instance: Object) {
    const ret = []
    base.forEach(a => {
      target.forEach(b => {
        apiMethods.forEach(c => {
          const p = `${a}${b}`
          ret.push({
            controller: instance,
            path: p,
            regex: pathToRegexp(p),
            method: c,
            fn
          })
        })
      })
    })
    return ret
  }

  private clean() {
    this.pool = []
  }
}