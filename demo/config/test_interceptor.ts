import { IncomingMessage, ServerResponse } from "http";
import HandleInterceptor from "../../core/config/interceptor/handle_interceptor";

export default class TestInterpotor implements HandleInterceptor {
  // 同步处理
  preHandle(req: IncomingMessage, res: ServerResponse, handle: any): boolean {
    console.log('123123: ', '测试拦截器生效')
    return true
  }

  // 异步处理
  // preHandle(req: IncomingMessage, res: ServerResponse, handle: any): Promise<boolean> {
  //   console.log('123123: ', '测试拦截器生效')
  //   return new Promise(r => {
  //     setTimeout(() => {
  //       r(true)
  //     }, 3000);
  //   })
  // }
  afterCompletion(req: IncomingMessage, res: ServerResponse, handle: any): void {
    console.log('123123', 'afterCompletion')
  }
}