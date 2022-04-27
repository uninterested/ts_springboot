import CorsRegistration, { ICorsConfigurationProps } from "./cors_registration";

export default class CorsRegistry {
  private registrations: CorsRegistration[] = []

  public addMapping(path: string): CorsRegistration {
    const registration = new CorsRegistration(path)
    this.registrations.push(registration)
    return registration
  }

  public getCorsConfigurations(): ICorsConfigurationProps[] {
    return this.registrations.map(registration => registration.getConfig())
  }
}