import 'reflect-metadata'

import { RestController, Configuration } from './class_decorator'

import { HttpMethod, GET, POST, PUT, DELETE, PATCH, RequestMapping, Header } from './function_decorator'

import { IOCDecorator } from './ioc_decorator'

import { Autowired } from './props_decorator'

import { Body, Request, PathValue, QueryValue, TDecorator, IParamsDefineProps } from './parameter_decorator'

export {
  RestController, Configuration,
  HttpMethod, GET, POST, PUT, DELETE, PATCH, RequestMapping, Header,
  IOCDecorator,
  Autowired,
  Body, Request, PathValue, QueryValue, TDecorator, IParamsDefineProps
}