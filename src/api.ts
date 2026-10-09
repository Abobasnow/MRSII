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

// ==================== MATERIALS ====================

export interface Material {
  id: number;
  title: string;
  type: 'TEXT' | 'LINK';
  content: string;
  teacher_id: number;
  student_id: number | null;
  created_at: string;
}

export interface CreateMaterialDto {
  title: string;
  type: 'TEXT' | 'LINK';
  content: string;
  student_id?: number | null;
}

export const materialApi = {
  create: async (
    teacherId: number,
    data: CreateMaterialDto
  ): Promise<Material> => {
    const response = await api.post<Material>(
      `/materials?teacher_id=${teacherId}`,
      data
    );
    return response.data;
  },

  getByTeacher: async (teacherId: number): Promise<Material[]> => {
    const response = await api.get<Material[]>(
      `/materials?teacher_id=${teacherId}`
    );
    return response.data;
  },
};

export default api;