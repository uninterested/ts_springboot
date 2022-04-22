import { IncomingMessage, ServerResponse } from "http";
import HandleInterceptor from "../../core/config/interceptor/handle_interceptor";

export default class TestInterpotor implements HandleInterceptor {
  preHandle(req: IncomingMessage, res: ServerResponse, handle: any) {
    console.log('123123: ', '测试拦截器生效')
    // throw new Error('fuck')
    return true
  }
  postHandle(req: IncomingMessage, res: ServerResponse, handle: any): void {
    
  }
  afterCompletion(req: IncomingMessage, res: ServerResponse, handle: any): void {
    
  }
}