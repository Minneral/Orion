import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('JWT');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api_login = (credentials: {
    'username': string,
    'password': string
}) => api.post('/login', credentials);

export const api_register = (credentials: {
    'username': string,
    'email': string,
    'password': string,
}) => api.post('/register', credentials);