import { HttpMethod } from "../../decorators";
import { array2Map } from "../../utils";

export interface ICorsConfigurationProps {
  allowedOrigins: string[]
  allowCredentials: boolean
  allowedMethods: HttpMethod[]
  maxAge: number
}

export default class CorsRegistration {
  public readonly path: string;
  private readonly config: ICorsConfigurationProps = {
    allowedOrigins: [],
    allowCredentials: false,
    allowedMethods: [],
    maxAge: 0,
  }

  constructor(path: string) {
    this.path = path
  }

  public allowedOrigins(...origins: string[]): CorsRegistration {
    const old = array2Map(this.config.allowedOrigins)
    const next = array2Map(origins)
    this.config.allowedOrigins = Object.keys({ ...old, next })
    return this
  }

  public allowCredentials(allow: boolean) {
    this.config.allowCredentials = allow
  }

  public allowedMethods(...allow: HttpMethod[]) {
    allow.forEach(me => {
      if (!this.config.allowedMethods.includes(me))
        this.config.allowedMethods.push(me)
    })
  }

  public maxAge(age: number) {
    if (age > 0) this.config.maxAge = age
    return this
  }

  public getConfig(): ICorsConfigurationProps {
    return {
      ...this.config,
      allowedOrigins: [...this.config.allowedOrigins],
      allowedMethods: [...this.config.allowedMethods],
    }
  }
}