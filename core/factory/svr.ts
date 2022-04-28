import { HttpMethod, IParamsDefineProps } from "../decorators"
import http from 'http'
import URL from 'url'
import QS from 'qs'
import { kHeaders, kParamType } from "../constant"
import InterceptorRegistry from "../config/interceptor/interceptor_registry"
import InterceptorRegistration from "../config/interceptor/interceptor_registration"
import HandlerMethod from "../config/interceptor/handler_method"
import CorsRegistry from "../config/annotation/cors_registry"
import NotFoundException from "../config/controller_advice/notfound_exception"

export interface IPoolProps {
  path: string
  regex: RegExp
  method: HttpMethod
  controller: Object
  fn: Function
}

export interface IConfigProps {
  registry: InterceptorRegistry
  corsRegistry: CorsRegistry
}

export interface IControllerAdviceHandle {
  controller: Object
  fn: Function
}

type THandleFn = (req: http.IncomingMessage, res: http.ServerResponse, handle: object) => Promise<void> | void

export default class Svr {
  private _pool: IPoolProps[];
  private _config: IConfigProps;
  private _exception: POJO<IControllerAdviceHandle>;

  private app?: http.Server
  constructor(pool: IPoolProps[], config: IConfigProps, exception: POJO<IControllerAdviceHandle>) {
    this._pool = pool
    this._config = config
    this._exception = exception
  }

  public listen(port: number, cb?: () => void) {
    if (this.app) this.app.close()
    this.app = http.createServer()
    this.app.on('request', async (req, res) => await this.processRequest(req, res))
    this.app.listen(port, cb)
  }

  private async processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const handle = this.findBest(req)
    const data = await this.innerParse(req)
    try {
      if (handle) {
        const params = this.handleParams(handle, data, req)
        const chain = this.getInterceptorChain(data.pathname)
        const afterChain: THandleFn[] = []
        const interceprotorResult = await this.executePreHandle(chain, req, res, handle, afterChain)
        if (!interceprotorResult) {
          this.send({ res, statusCode: 200, result: undefined, handle, pathname: data.pathname })
        } else {
          const ret = await handle.fn.apply(handle.controller, params)
          this.send({ res, statusCode: 200, result: ret, handle, pathname: data.pathname })
        }
        this.executeAfterCompletion(afterChain.reverse(), req, res, handle)
      } else {
        throw new NotFoundException('route not found')
      }
    } catch (ex: any) {
      const { code, msg } = this.handleException(ex) ?? ex.message ?? ex
      this.send({ res, statusCode: code, result: msg, handle, pathname: data.pathname })
    }
  }

  private handleException(ex: any) {
    const { name } = ex
    if (this._exception[name]) {
      const { fn, controller } = this._exception[name]
      const ret = fn.apply(controller, [ex])
      return { code: 200, msg: ret }
    }
    const code = ex.name === 'NotFoundException' ? 404 : 500
    return { code: code, msg: undefined }
  }

  private send(opts: { res: http.ServerResponse, statusCode: number, result: any, handle: IPoolProps, pathname?: string }) {
    const { res, statusCode, result, handle, pathname } = opts
    const corss = this._config.corsRegistry.getCorsConfigurations()
    const cors = corss.find(cors => cors.regexp?.test(pathname))
    if (cors) {
      if (cors.allowCredentials) res.setHeader('Access-Control-Allow-Credentials', cors.allowCredentials.toString())
      if (cors.allowedOrigins.length) res.setHeader('Access-Control-Allow-Origin', cors.allowedOrigins.join(','))
      if (cors.allowedMethods.length) res.setHeader('Access-Control-Allow-Methods', cors.allowedMethods.join(','))
      if (cors.maxAge !== undefined) res.setHeader('Access-Control-Max-Age', cors.maxAge)
      if (cors.allowedHeaders.length) res.setHeader('Access-Control-Allow-Headers', cors.allowedHeaders.join(','))
    }
    this.setHeader(handle, res)
    res.statusCode = statusCode
    res.end(this.parseResponse(result))
  }

  private async executePreHandle(
    chain: InterceptorRegistration[],
    req: http.IncomingMessage,
    res: http.ServerResponse,
    handle: IPoolProps,
    afterChain: THandleFn[]
  ) {
    const handleMethod = new HandlerMethod(handle)
    const iteration = async (list: InterceptorRegistration[]) => {
      if (list.length <= 0) return true
      const firstInterceptor = list.shift()
      const result = await firstInterceptor.interceptor.preHandle(req, res, handleMethod)
      if (result) {
        afterChain.push(firstInterceptor.interceptor.afterCompletion)
        return await iteration(list)
      }
      return false
    }
    return await iteration([...chain])
  }

  private executeAfterCompletion(chain: THandleFn[], req: http.IncomingMessage, res: http.ServerResponse, handle: IPoolProps) {
    const handleMethod = new HandlerMethod(handle)
    chain.forEach(async c => {
      try {
        await c(req, res, handleMethod)
      } finally {
        // empty
      }
    })
  }

  private getInterceptorChain(pathname: string) {
    const interceptors = this._config.registry.getInterceptors()
    // 查找出合适的拦截器
    return interceptors.filter(interceptor => {
      if (interceptor.excludeRegexp.some(rule => rule.test(pathname))) return false
      return interceptor.allowedRegexp.some(rule => rule.test(pathname))
    })
  }

  private setHeader(handle: IPoolProps, res: http.ServerResponse) {
    const headers = {
      'Content-Type': 'application/json',
      ...(handle ? Reflect.getMetadata(kHeaders, handle.fn) : undefined)
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