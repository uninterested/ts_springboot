import 'reflect-metadata'

import { RestController } from './class_decorator'

import { HttpMethod, GET, POST, PUT, DELETE, PATCH, RequestMapping } from './function_decorator'

import { IOCDecorator } from './ioc_decorator'

import { Autowired } from './props_decorator'

import { Body, Request, PathValue, QueryValue, TDecorator, IParamsDefineProps } from './parameter_decorator'

export {
  RestController,
  HttpMethod, GET, POST, PUT, DELETE, PATCH, RequestMapping,
  IOCDecorator,
  Autowired,
  Body, Request, PathValue, QueryValue, TDecorator, IParamsDefineProps
}