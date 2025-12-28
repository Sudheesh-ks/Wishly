import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("wishly_user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.role === "user" && response.data.token) {
          localStorage.setItem("wishly_user_token", response.data.token);
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("wishly_user_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
