import http from 'http'

export default abstract class HandleInterceptor {
    abstract preHandle(req: http.IncomingMessage, res: http.ServerResponse, handle: any): boolean
    abstract postHandle(req: http.IncomingMessage, res: http.ServerResponse, handle: any): void
    abstract afterCompletion(req: http.IncomingMessage, res: http.ServerResponse, handle: any): void
}