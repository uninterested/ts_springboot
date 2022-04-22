import { IOCDecorator } from "../core/decorators/ioc_decorator";
import MyConfig from "./config";
import EventController from "./controller/event_controller";
import UserController from "./controller/user_controller";

@IOCDecorator({
  controllers: [UserController, EventController],
  configs: [MyConfig]
})
export default class Module {

}