import axios, { AxiosRequestConfig } from "axios";


const axiosConfig: AxiosRequestConfig = {
    baseURL: "https://ee82mju52j.execute-api.us-east-1.amazonaws.com/Prod/",
    timeout: 20000,
    headers:{
        'Content-Type': 'application/json'
    }
}

export const api = axios.create(axiosConfig);