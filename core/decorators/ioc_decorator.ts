export interface IIocMata {
  controllers?: Function[]
  configs?: Function[]
}

export const IOCDecorator = (meta: IIocMata): ClassDecorator => {
  const { controllers = [], configs = [] } = meta
  return (target: Function) => {
    Reflect.defineMetadata('controllers', controllers, target)
    Reflect.defineMetadata('configs', configs, target)
  }
}