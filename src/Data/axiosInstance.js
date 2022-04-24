import axios from "axios";
import { Variables } from "./Variables";


const baseURL = Variables.API_URL;

const axiosInstance = axios.create({
    baseURL,
    headers:{'Content-Type': 'application/json'}
});

export default axiosInstance;