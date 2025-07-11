import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://93.127.166.229:5000/', 
  //baseURL: 'http://localhost:5000/', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('lafuser_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
