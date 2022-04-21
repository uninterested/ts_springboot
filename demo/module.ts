import { IOCDecorator } from "../core/decorators/ioc_decorator";
import UserController from "./controller/user";

@IOCDecorator({
  controllers: [UserController]
})
export default class Module {

}