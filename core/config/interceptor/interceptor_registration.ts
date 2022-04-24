import { pathToRegexp } from "path-to-regexp";
import { array2Map } from "../../utils";
import HandleInterceptor from "./handle_interceptor";

export default class InterceptorRegistration {
  public readonly interceptor: HandleInterceptor
  public allowedPaths: string[] = []
  public excludePaths: string[] = []

  public allowedRegexp: RegExp[] = []
  public excludeRegexp: RegExp[] = []

  constructor(interceptor: HandleInterceptor) {
    this.interceptor = interceptor
  }

  public addPathPatterns(...path: string[]) {
    const old = array2Map(this.allowedPaths)
    const next = array2Map(path)
    this.allowedPaths = Object.keys({...old, ...next })
    this.allowedRegexp = this.allowedPaths.map(path => pathToRegexp(path.replace(/\*/g, '(.*)')))
    return this
  }

  public excludePathPatterns(...path: string[]) {
    const old = array2Map(this.excludePaths)
    const next = array2Map(path)
    this.excludePaths = Object.keys({...old, ...next })
    this.excludeRegexp = this.excludePaths.map(path => pathToRegexp(path.replace(/\*/g, '(.*)')))
    return this
  }
}