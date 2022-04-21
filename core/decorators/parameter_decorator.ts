import { kParamType } from "../constant"

export const Body: ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
  getParamType(target, propertyKey, parameterIndex, 'Body')
}

export const Request: ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
  getParamType(target, propertyKey, parameterIndex, 'Request')
}

export const PathValue = (key: string): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    getParamType(target, propertyKey, parameterIndex, 'PathValue', key)
  }
}

export const QueryValue = (key: string): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    getParamType(target, propertyKey, parameterIndex, 'QueryValue', key)
  }
}

export type TDecorator = 'Body' | 'PathValue' | 'QueryValue' | 'Request'

export interface IParamsDefineProps {
  paramsType: string
  decorator: TDecorator,
  key?: string
}

const getParamType = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
  decorator: TDecorator,
  key?: string
) => {
  const type = Reflect.getMetadata('design:paramtypes', target, propertyKey) // 获取参数的类型
  const paramsType = type[parameterIndex].name
  const value = Reflect.getMetadata(kParamType, target[propertyKey]) || []
  const obj = {
    paramsType,
    decorator,
    key
  }
  value[parameterIndex] = obj
  Reflect.defineMetadata(kParamType, value, target[propertyKey])
}