import Api from './api';

class EnterpriseService extends Api {

  async createEnterprise(data: any) {
    try {
      return this.instance.post(`/enterprise/create`, data);
    } catch (error) {
      console.log(error);
    }
  }

  async login(data: any) {
    try {
      return this.instance.post(`/enterprise/login`, data);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new EnterpriseService();
