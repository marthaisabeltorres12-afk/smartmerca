const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error en la solicitud');
  return data;
};
