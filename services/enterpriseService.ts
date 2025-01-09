import Api from "./api";

class EnterpriseService {
  private static base_path = "/enterprise";

  static async createEnterprise(data: any) {
    try {
      const response = await Api.post(`${this.base_path}/create`, data);
      console.log("response: ", response);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default EnterpriseService;
