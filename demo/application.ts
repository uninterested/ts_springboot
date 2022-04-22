import Factory from "../core/factory"
import Module from "./module"

class Application {
  static runApplication(port: number, cb?: () => void) {
    const app = new Factory().create(Module)
    app.listen(port, cb)
  }
}

Application.runApplication(3000, () => console.log('监听端口中 3000 ...'))