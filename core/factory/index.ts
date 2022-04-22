import { pathToRegexp } from 'path-to-regexp'
import InterceptorRegistry from '../config/interceptor/interceptor_registry';
import { kApiMethod, kMethod, kPath } from "../constant";
import { HttpMethod } from "../decorators";
import Svr, { IPoolProps, IConfigProps } from "./svr";


export default class Factory {
  private pool: IPoolProps[] = []
  private config: IConfigProps = {
    registry: new InterceptorRegistry()
  }

  create(module: Function) {
    this.clean()
    this.builder(module)
    return new Svr(this.pool, this.config)
  }

  private builder(module: Function) {
    const controllers = Reflect.getMetadata('controllers', module) as (typeof Function)[]
    const configs = Reflect.getMetadata('configs', module) as (typeof Function)[]
    if (controllers.length <= 0) throw new Error('no controller found')
    this.buildConfig(configs)
    this.buildController(controllers)
  }

  private buildController(controllers: (typeof Function)[]) {
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

  private buildConfig(configs: (typeof Function)[]) {
    configs.forEach((Fn) => {
      const instance = new Fn()
      // 注入拦截器
      instance['addInterceptors'](this.config.registry)
    })
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