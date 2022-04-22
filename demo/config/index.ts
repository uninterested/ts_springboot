import CorsRegistry from "../../core/config/annotation/cors_registry";
import InterceptorRegistry from "../../core/config/interceptor/interceptor_registry";
import WebConfig from "../../core/config/web_config";
import TestInterpotor from "./test_interceptor";

export default class MyConfig implements WebConfig {
  addInterceptors(registry: InterceptorRegistry): void {
    console.log('注入拦截器')
    registry.addInterceptor(new TestInterpotor())
      .addPathPatterns('/**')
  }
  addCorsMappings(registry: CorsRegistry): void {

  }
}