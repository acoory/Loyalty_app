import axios from "axios";

class instance {
  public axios = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default new instance().axios;
