import axios, { AxiosRequestConfig } from 'axios';

export const baseUrl =
  'https://ee82mju52j.execute-api.us-east-1.amazonaws.com/Prod/';

const axiosConfig: AxiosRequestConfig = {
  baseURL: baseUrl,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(axiosConfig);

export const QUERY_FILES_KEY = (sid?: string) => ['files', sid];

export const TEXT_QUERY_KEY = (sid?: string) => ['text-content', sid];
