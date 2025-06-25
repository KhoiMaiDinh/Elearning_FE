'use client';
import axios from 'axios';
import { clearUser } from '@/constants/userSlice';
import store from '@/constants/store';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const clearLoginData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires');
  store.dispatch(clearUser());
};

// Gắn access token vào mỗi request
axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    // Decode token and check status
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        // Let the response interceptor handle token refresh
        return config;
      }

      // Check if user is banned
      if (decodedToken.banned_until) {
        clearLoginData();
        window.location.href = '/login?error=banned';
        return Promise.reject(new Error('Tài khoản đã bị khóa'));
      }

      // Add token to headers
      config.headers['authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Token decode error:', error);
      clearLoginData();
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Xử lý lỗi response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      // Check for banned user
      if (status === 401 && data.errorCode === 'auth.error.banned') {
        clearLoginData();
        window.location.href = '/login?error=banned';
        return Promise.reject(error);
      }

      // Handle unverified email
      if (status === 401 && data.errorCode === 'auth.error.unverified') {
        clearLoginData();
        window.location.href = '/login?error=unverified';
        return Promise.reject(error);
      }
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Nếu đang chờ refresh, đưa request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`);
        console.trace(res);

        const newAccessToken = res.data.access_token;

        // Lưu token mới
        localStorage.setItem('access_token', newAccessToken);
        axiosInstance.defaults.headers.common['authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Gửi lại request cũ
        originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Nếu refresh thất bại => logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
