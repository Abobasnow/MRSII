import React, { useState } from 'react';
import { authApi } from '../api';
import type { RegisterDto } from '../api';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterDto>({
    email: '',
    password: '',
    full_name: '',
    role_id: 3,
    avatar_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user = await authApi.register(formData);
      setSuccess(`Пользователь ${user.full_name} успешно создан! (id: ${user.id})`);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role_id: 3,
        avatar_url: '',
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SUNC.Progress</h1>
        <p style={styles.subtitle}>Регистрация</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Пароль:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={4}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Полное имя:</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Роль:</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              style={styles.input}
            >
              <option value={3}>Ученик</option>
              <option value={2}>Репетитор</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ссылка на аватарку (необязательно):</label>
            <input
              type="text"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              style={styles.input}
            />
          </div>

          {formData.avatar_url && (
            <div style={styles.avatarPreview}>
              <img
                src={formData.avatar_url}
                alt="avatar"
                style={styles.avatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? 'Отправка...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '420px',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '28px',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#888',
    textAlign: 'center',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontSize: '14px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 600,
    marginTop: '8px',
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    background: '#aaa',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'not-allowed',
    fontWeight: 600,
    marginTop: '8px',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  success: {
    background: '#efe',
    color: '#3a3',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  avatarPreview: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #667eea',
  },
};