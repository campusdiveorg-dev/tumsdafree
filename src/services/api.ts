const BASE = '/api';

let _csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  _csrfToken = token;
}

export function getCsrfToken() {
  return _csrfToken;
}

async function request(method: string, path: string, body: any = null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_csrfToken) headers['X-CSRF-Token'] = _csrfToken;

  const options: RequestInit = {
    method,
    credentials: 'include',
    headers,
  };
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error || `Request failed: ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body?: any) => request('POST', path, body),
  put: (path: string, body?: any) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
};

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const contentApi = {
  list: (table: string) => api.get(`/${table}`),
  get: (table: string, id: number | string) => api.get(`/${table}/${id}`),
  create: (table: string, data: any) => api.post(`/${table}`, data),
  update: (table: string, id: number | string, data: any) => api.put(`/${table}/${id}`, data),
  delete: (table: string, id: number | string) => api.delete(`/${table}/${id}`),
};

export const usersApi = {
  list: () => api.get('/users'),
  get: (id: number | string) => api.get(`/users/${id}`),
  update: (id: number | string, data: any) => api.put(`/users/${id}`, data),
  deactivate: (id: number | string) => api.delete(`/users/${id}`),
  delete: (id: number | string) => api.delete(`/users/${id}?permanent=true`),
};

export const paymentsApi = {
  list: () => api.get('/payments'),
};
