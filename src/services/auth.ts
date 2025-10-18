import api from './api';

export async function registerUser(payload:{
  username:string; firstName:string; lastName:string; email:string; password:string;
}) {
  const result = await api.post('/api/auth/register', payload);
  return result.data;
}

export async function loginUser(payload:{ email:string; password:string }) {
  const result = await api.post('/api/auth/login', payload);
  return result.data;
}
