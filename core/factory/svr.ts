import { HttpMethod, IParamsDefineProps } from "../decorators"
import http from 'http'
import URL from 'url'
import QS from 'qs'
import { kHeaders, kParamType } from "../constant"
import InterceptorRegistry from "../config/interceptor/interceptor_registry"

export interface IPoolProps {
  path: string
  regex: RegExp
  method: HttpMethod
  controller: Object
  fn: Function
}

export interface IConfigProps {
  registry: InterceptorRegistry
}

export default class Svr {
  private _pool: IPoolProps[];
  private _config: IConfigProps;
  private app?: http.Server
  constructor(pool: IPoolProps[], config: IConfigProps) {
    this._pool = pool
    this._config = config
  }

  public listen(port: number, cb?: () => void) {
    if (this.app) this.app.close()
    this.app = http.createServer()
    this.app.on('request', async (req, res) => await this.processRequest(req, res))
    this.app.listen(port, cb)
  }

  private async processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
   const handle = this.findBest(req)
    if (handle) {
      try {
        const data = await this.innerParse(req)
        const params = this.handleParams(handle, data, req)
        
        const ret = await handle.fn.apply(handle.controller, params)
        res.statusCode = 200
        this.setHeader(handle, res)
        res.end(this.parseResponse(ret))
      } catch (ex: any) {
        res.statusCode = 500
        res.end(ex instanceof Error ? ex.message : (ex.message || ex))
      }
    } else {
      res.statusCode = 404
      res.end()
    }
  }

  private async executeInterceptor(req: http.IncomingMessage, res: http.ServerResponse, handle: IPoolProps, pathname: string) {
    const interceptors = this._config.registry.getInterceptors()
    for (let i = 0; i < interceptors.length; i++) {
      const interceptor = interceptors[i]
      // interceptor.excludePathPatterns
      // interceptor.allowedPaths
      // interceptor.interceptor.preHandle()
    }
    // .forEach(interceptor => {
    //   interceptor.interceptor.preHandle(req, res, {})
    // })
  }

  private setHeader(handle: IPoolProps, res: http.ServerResponse) {
    const headers = {
      'Content-Type': 'application/json',
      ...Reflect.getMetadata(kHeaders, handle.fn)
    }
    Object.keys(headers).forEach(h => res.setHeader(h, headers[h]))
  }

  private innerParse(req: http.IncomingMessage): Promise<any> {
    return new Promise(resolve => {
      let str = ''
      req.on('data', thunk => str += thunk)
      req.on('end', () => {
        const { pathname, query } = URL.parse(req.url);
        (req as any).body = str
        resolve({
          body: str || {},
          pathname,
          query,
          Query: QS.parse(query)
        })
      })
    })
  }

  private handleParams(handle: IPoolProps, data: any, req: http.IncomingMessage) {
    const paramArray = (Reflect.getMetadata(kParamType, handle.fn) || []) as IParamsDefineProps[]
    const { pathname, body, Query } = data
    const keys = handle.path.split('/:')
    const values = pathname.match(handle.regex)
    const Params = {}
    keys.forEach((k, i) => {
      if (i !== 0) Params[k] = values[i]
    })
    return paramArray.map(e => {
      if (e.decorator === 'Body') {
        return this.transferType(e.paramsType, body)
      } else if (e.decorator === 'PathValue') {
        return this.transferType(e.paramsType, Params[e.key])
      } else if (e.decorator === 'QueryValue') {
        return this.transferType(e.paramsType, Query[e.key])
      } else if (e.decorator === 'Request') {
        return req
      }
      return undefined
    })
  }

  private transferType(paramsType: string, input: string) {
    switch (paramsType.toLowerCase()) {
      case 'number':
        return parseInt(input)
      case 'object':
        return JSON.parse(input)
      default:
        return input
    }
  }

  private findBest(req: http.IncomingMessage): IPoolProps | undefined {
    const url = req.url
    const method = req.method
    const { pathname } = URL.parse(url)
    return this._pool.find(e => {
      if (e.method === method?.toUpperCase())
        if (e.regex.test(pathname)) return true
      return false
    })
  }

  private parseResponse(response: any) {
    const type = Object.prototype.toString.call(response)
    if (['[object Array]', '[object Object]',].includes(type)) return JSON.stringify(response)
    return response
  }
}