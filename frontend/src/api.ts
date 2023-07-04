import axios, { AxiosRequestConfig } from "axios";


const axiosConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:8080",
    timeout: 20000,
    headers:{
        'Content-Type': 'application/json'
    }
}

export const api = axios.create(axiosConfig);