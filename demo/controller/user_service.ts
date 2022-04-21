export default class UserService {
  public async test() {
    return {
      user: '123'
    }
  }
  public response(s: string, d: number, user: any) {
    console.log('i receive :', s, d, user)
    return "hello from service of response"
  }
}