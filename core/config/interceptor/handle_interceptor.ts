import http from 'http'

export default interface HandleInterceptor {
    preHandle(req: http.IncomingMessage, res: http.ServerResponse, handle: any): Promise<boolean> | boolean
    postHandle(req: http.IncomingMessage, res: http.ServerResponse, handle: any): Promise<void> | void
    afterCompletion(req: http.IncomingMessage, res: http.ServerResponse, handle: any): Promise<void> | void
}