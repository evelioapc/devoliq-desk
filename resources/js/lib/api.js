import axios from 'axios';
import { router } from '@inertiajs/react';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  },
  withCredentials: true,
});

const csrfMeta = document.querySelector('meta[name="csrf-token"]');
if (csrfMeta) {
  api.defaults.headers.common['X-XSRF-TOKEN'] = csrfMeta.getAttribute('content');
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      router.visit('/login');
    }
    if (status === 402) {
      const message =
        error?.response?.data?.message || 'Límite del plan alcanzado.';
      window.dispatchEvent(
        new CustomEvent('plan-limit', {
          detail: { message, data: error.response?.data },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
