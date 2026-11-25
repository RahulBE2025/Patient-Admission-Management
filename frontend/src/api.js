import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api' });
export const getPatients = (params) => api.get('/patients/', { params });
export const createPatient = (data) => api.post('/patients/', data);
export const updatePatient = (id, data) => api.patch(`/patients/${id}/`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}/`);
export const dischargePatient = (id) => api.patch(`/patients/${id}/discharge/`);
export function errorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return 'Unable to reach the server. Check that Django is running.';
  }

  if (typeof data === 'string') {
    return data.slice(0, 500);
  }

  if (typeof data === 'object') {
    return Object.entries(data)
      .map(([key, value]) => {
        const message = Array.isArray(value)
          ? value.join(', ')
          : typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);

        return `${key}: ${message}`;
      })
      .join('\n');
  }

  return String(data);
}