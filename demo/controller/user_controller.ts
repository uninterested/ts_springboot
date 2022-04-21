import  { RestController, GET, POST, Autowired, PathValue, QueryValue, Body, Header } from '../../core/decorators'
import UserService from './user_service';

interface IUser {
  name: string
  age: number
}

@RestController('/user')
export default class UserController {
  @Autowired
  userService: UserService;

  @GET('/hello')
  @Header({
    'Cache-Control': 'max-age=100',
    // 'Content-Type': 'text/plain'
  })
  hello1() {
    return this.userService.test()
  }

  @POST('/hello/:s')
  hello2(@PathValue("s") s: string, @QueryValue("d") d: number, @Body user: IUser) {
    return this.userService.response(s, d, user)
  }
}