import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import router from '@/router'; 

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL + '/api/' || 'http://localhost:8000/api/';

axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('userToken');

        config.headers = config.headers || {};

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401 && router.currentRoute.name !== 'login') {
            
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            
            console.warn("Sessão expirada. Redirecionando para login.");
            
            router.push({ name: 'login', query: { session: 'expired' } });
        }
        
        return Promise.reject(error);
    }
);

export default axios;