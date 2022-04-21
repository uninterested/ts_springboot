export interface IIocMata {
  controllers?: Function[]
}

export const IOCDecorator = (meta: IIocMata): ClassDecorator => {
  const { controllers = [] } = meta
  return (target: Function) => {
    Reflect.defineMetadata('controllers', controllers, target)
  }
}