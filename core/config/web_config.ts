import CorsRegistry from "./annotation/cors_registry"
import InterceptorRegistry from "./interceptor/interceptor_registry"

export default interface WebConfig {
  // addFormatters(): void
  // addResourceHandlers(): void
  addInterceptors(registry: InterceptorRegistry): void
  addCorsMappings(registry: CorsRegistry): void
}