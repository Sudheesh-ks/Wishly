import axios from 'axios';

const santaApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

// Request interceptor to add santa token
santaApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('wishly_santa_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors and refresh token
santaApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post('http://localhost:5000/auth/refresh', {}, { withCredentials: true });

                if (response.data.role === 'santa' && response.data.token) {
                    localStorage.setItem('wishly_santa_token', response.data.token);
                    originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                    return santaApi(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('wishly_santa_token');
                window.location.href = '/santa/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default santaApi;
