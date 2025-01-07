import axios from "axios";

class Api {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://localhost:8080";
  }

  async get(endpoint: string) {
    return axios.get(`${this.baseUrl}/${endpoint}`);
  }

  async post(endpoint: string, data: any) {
    console.log("Data:", data);
    console.log("Endpoint:", this.baseUrl + "/" + endpoint);

    return axios.post(`${this.baseUrl}/${endpoint}`, data);
  }

  async put(endpoint: string, data: any) {
    return axios.put(`${this.baseUrl}/${endpoint}`, data);
  }

  async delete(endpoint: string) {
    return axios.delete(`${this.baseUrl}/${endpoint}`);
  }
}

export default new Api();
