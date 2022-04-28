export default class UserService {
  public async test() {
    return {
      user: '123'
    }
  }
  public response(s: string, d: string, user: any) {
    console.log('i receive :', s, d, user)
    return {message: 'data from response'}
  }
}