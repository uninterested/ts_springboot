import NotFoundException from "../../core/config/controller_advice/notfound_exception";
import { ControllerAdvice } from "../../core/decorators/class_decorator";
import { ExceptionHandler } from "../../core/decorators/function_decorator";

@ControllerAdvice
export default class Adv {
    @ExceptionHandler(Error.name)
    handleException(ex: Error): any {
        return {error: 'exception:' + ex.message}
    }

    @ExceptionHandler(NotFoundException.name)
    handleNotFound(ex: NotFoundException): any {
        return { error: 'route not found' }
    }
}