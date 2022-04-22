import CorsRegistration, { ICorsConfigurationProps } from "./cors_registration";

export default class CorsRegistry {
  private registrations: CorsRegistration[] = []

  public addMapping(path: string): CorsRegistration {
    const registration = new CorsRegistration(path)
    this.registrations.push(registration)
    return registration
  }

  protected getCorsConfigurations(): POJO<ICorsConfigurationProps> {
    const hashMap: POJO<ICorsConfigurationProps> = {}
    this.registrations.forEach(registration => hashMap[registration.path] = registration.getConfig())
    return hashMap
  }
}