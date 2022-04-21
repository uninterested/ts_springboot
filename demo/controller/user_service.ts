export default class UserService {
  public test() {
    return 'response from user service test'
  }
  public response(s: string, d: number, user: any) {
    console.log('i receive :', s, d, user)
    return "hello from service of response"
  }
}