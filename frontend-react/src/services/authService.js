import { apiFetch } from './api';

export const authService = {
  forgotPassword: (email) => apiFetch('/auth/forgot-password', {
    method: 'POST', body: JSON.stringify({ email })
  }),
  resetPassword: (token, new_password) => apiFetch('/auth/reset-password', {
    method: 'POST', body: JSON.stringify({ token, new_password })
  }),
};
