import axios from "axios";


export const axiosapi = axios.create({
  baseURL: "http://localhost:5059/api",
});
export default axiosapi;

