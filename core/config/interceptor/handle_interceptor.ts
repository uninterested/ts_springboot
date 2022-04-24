import http from 'http'

export default interface HandleInterceptor {
    preHandle(req: http.IncomingMessage, res: http.ServerResponse, handle: object): Promise<boolean> | boolean
    afterCompletion(req: http.IncomingMessage, res: http.ServerResponse, handle: object): Promise<void> | void
}