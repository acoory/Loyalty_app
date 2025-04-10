import Api from './api';

class AuthService extends Api {

  async login(data: any) {
    try {
      return this.instance.post(`/api/auth/login`, data);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new AuthService();
