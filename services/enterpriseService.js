import Api from "./api";

class EnterpriseService {
  static async createEnterprise(data) {
    try {
      const response = await Api.post("create", data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default EnterpriseService;
