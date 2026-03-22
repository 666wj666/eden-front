import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const baseURL = ''; // Use current origin for full-stack setup

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('eden_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    const res = response.data;
    // Assuming the backend returns { code: number, message: string, data: T }
    if (res.code !== 0) {
      // Handle business errors
      console.error(res.message || 'Error');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data;
  },
  (error) => {
    console.error('Network Error:', error.message);
    return Promise.reject(error);
  }
);

export default http;
