import CorsRegistry from "../../core/config/annotation/cors_registry";
import InterceptorRegistry from "../../core/config/interceptor/interceptor_registry";
import WebConfig from "../../core/config/web_config";
import { Configuration, HttpMethod } from "../../core/decorators";
import TestInterpotor from "./test_interceptor";

@Configuration
export default class MyConfig implements WebConfig {
  addInterceptors(registry: InterceptorRegistry): void {
    registry.addInterceptor(new TestInterpotor())
      .addPathPatterns('/**')
  }
  addCorsMappings(registry: CorsRegistry): void {
    registry.addMapping("/user/*")
      .allowCredentials(true)
      .allowedMethods(HttpMethod.GET, HttpMethod.DELETE, HttpMethod.PATCH, HttpMethod.POST, HttpMethod.PUT, HttpMethod.OPTIONS)
      .allowedHeaders('*')
      .allowedOrigins("*")
      .maxAge(2000)
  }
}