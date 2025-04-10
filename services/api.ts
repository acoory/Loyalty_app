import axios from "axios";
import Config from "react-native-config";

export default class Api {
  public instance: any;
  constructor() {
    const baseURL = `http://localhost:8080`;
    this.instance = axios.create({
      baseURL: `${baseURL}`,
      withCredentials: true,
    });
  }
}
