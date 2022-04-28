import  { RestController, GET, POST, Autowired, PathValue, QueryValue, Body, Header, Request } from '../../core/decorators'
import UserService from '../services/user_service';

interface IUser {
  name: string
  age: number
}

@RestController('/user')
export default class UserController {
  @Autowired
  userService: UserService;

  @GET('/hello')
  hello1() {
    return this.userService.test()
  }

  @POST('/hello/:s')
  @Header({
    'Content-Type': 'application/json'
  })
  hello2(@Request req, @PathValue("s") s: string, @QueryValue("d") d: string, @Body user: IUser) {
    return this.userService.response(s, d, user)
  }
}