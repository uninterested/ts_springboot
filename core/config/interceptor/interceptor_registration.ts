import { array2Map } from "../../utils";
import HandleInterceptor from "./handle_interceptor";

export default class InterceptorRegistration {
  public readonly interceptor: HandleInterceptor
  public allowedPaths: string[] = []
  public excludePaths: string[] = []

  constructor(interceptor: HandleInterceptor) {
    this.interceptor = interceptor
  }

  public addPathPatterns(...path: string[]) {
    const old = array2Map(this.allowedPaths)
    const next = array2Map(path)
    this.allowedPaths = Object.keys({...old, ...next })
    return this
  }

  public excludePathPatterns(...path: string[]) {
    const old = array2Map(this.excludePaths)
    const next = array2Map(path)
    this.excludePaths = Object.keys({...old, ...next })
    return this
  }
}