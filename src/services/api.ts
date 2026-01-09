import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    // Usa a URL do Render em produção ou localhost em desenvolvimento
    baseURL: "https://back-end-443z.onrender.com",
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

export default api;