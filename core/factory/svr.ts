import { HttpMethod, IParamsDefineProps } from "../decorators"
import http from 'http'
import URL from 'url'
import QS from 'qs'
import { kParamType } from "../constant"
// const http = require('http')

export interface IPoolProps {
  path: string
  regex: RegExp
  method: HttpMethod
  controller: Object
  fn: Function
}

export default class Svr {
  private _pool: IPoolProps[];
  private app?: http.Server
  constructor(pool: IPoolProps[]) {
    this._pool = pool
  }

  public listen(port: number, cb?: () => void) {
    if (this.app) this.app.close()
    this.app = http.createServer()
    this.app.on('request', async (req, res) => {
      const data = await this.innerParse(req)
      const handle = this.findBest(req)
      if (handle) {
        const params = this.handleParams(handle, data, req)
        const ret = handle.fn.apply(handle.controller, params)
        res.statusCode = 200
        res.end(ret)
      } else {
        res.statusCode = 404
        res.end()
      }
    })
    this.app.listen(port, cb)
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
}