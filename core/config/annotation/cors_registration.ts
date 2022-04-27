import { pathToRegexp } from "path-to-regexp";
import { HttpMethod } from "../../decorators";
import { array2Map } from "../../utils";

export interface ICorsConfigurationProps {
  allowedOrigins: string[]
  allowCredentials: boolean
  allowedMethods: HttpMethod[]
  allowedHeaders: string[]
  maxAge?: number
  regexp?: RegExp
}

export default class CorsRegistration {
  public readonly path: string;
  private readonly pathRegexp: RegExp
  private readonly config: ICorsConfigurationProps = {
    allowedOrigins: [],
    allowCredentials: false,
    allowedMethods: [],
    allowedHeaders: [],
    maxAge: undefined,
  }

  constructor(path: string) {
    this.path = path
    this.pathRegexp = pathToRegexp(path.replace(/\*/g, '(.*)'))
  }

  public allowedOrigins(...origins: string[]): CorsRegistration {
    const old = array2Map(this.config.allowedOrigins)
    const next = array2Map(origins)
    this.config.allowedOrigins = Object.keys({ ...old, ...next })
    return this
  }

  public allowCredentials(allow: boolean) {
    this.config.allowCredentials = allow
    return this
  }

  public allowedMethods(...allow: HttpMethod[]) {
    allow.forEach(me => {
      if (!this.config.allowedMethods.includes(me))
        this.config.allowedMethods.push(me)
    })
    return this
  }

  public allowedHeaders(...allow: string[]) {
    const old = array2Map(this.config.allowedHeaders)
    const next = array2Map(allow)
    this.config.allowedHeaders = Object.keys({ ...old, ...next })
    return this
  }

  public maxAge(age: number) {
    if (age > 0) this.config.maxAge = age
    return this
  }

  public getConfig(): ICorsConfigurationProps {
    return {
      ...this.config,
      regexp: this.pathRegexp,
      allowedOrigins: [...this.config.allowedOrigins],
      allowedMethods: [...this.config.allowedMethods],
    }
  }
}