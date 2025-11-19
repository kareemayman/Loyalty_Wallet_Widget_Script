import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nasnavApi = 'https://api.uat.meetusvr.com/';
export const yeshteryApi = 'https://api-yeshtery.uat.meetusvr.com/v1/';
export const localApi = 'http://localhost:8060/v1/';
export const yeshteryUatApi = 'https://api-yeshtery.uat.meetusvr.com/v1/';

// Create a custom axios instance
export const api = axios.create();

// Add a response interceptor to handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      !(error.config && error.config.headers && error.config.headers['X-Skip-401-Interceptor'])
    ) {
      try {
        const { logout } = useAuth();
        if (logout) logout();
      } catch (e) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);