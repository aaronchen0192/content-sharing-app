import axios, { AxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  //baseURL: 'http://127.0.0.1:4566',
  baseURL: 'https://ee82mju52j.execute-api.us-east-1.amazonaws.com/Prod/',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(axiosConfig);

export const QUERY_FILES_KEY = ['files'];

export const TEXT_QUERY_KEY = ['text-content'];
