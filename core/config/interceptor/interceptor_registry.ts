import HandleInterceptor from "./handle_interceptor";
import InterceptorRegistration from "./interceptor_registration";

export default class InterceptorRegistry {
  private readonly list: InterceptorRegistration[] = []

  public addInterceptor(interceptor: HandleInterceptor): InterceptorRegistration {
    const registration = new InterceptorRegistration(interceptor)
    this.list.push(registration)
    return registration
  }
  public getInterceptors() {
    return [...this.list]
  }
}