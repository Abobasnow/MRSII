import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterDto {
  email: string;
  password: string;
  full_name: string;
  role_id: number;
  avatar_url?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  role_id: number;
  created_at: string;
}

export const authApi = {
  register: async (data: RegisterDto): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/auth/register', data);
    return response.data;
  },
};

export default api;