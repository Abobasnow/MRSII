import React, { useEffect, useState } from 'react';
import { materialApi } from '../api';
import type { Material, CreateMaterialDto } from '../api';

// Пока захардкодим ID репетитора (позже возьмём из авторизации)
const TEACHER_ID = 2;

export const TeacherPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateMaterialDto>({
    title: '',
    type: 'TEXT',
    content: '',
    student_id: null,
  });

  // Загрузка списка материалов
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await materialApi.getByTeacher(TEACHER_ID);
      setMaterials(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить материалы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'student_id'
          ? value === ''
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await materialApi.create(TEACHER_ID, formData);
      setSuccess('Материал добавлен!');
      setFormData({ title: '', type: 'TEXT', content: '', student_id: null });
      await fetchMaterials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Ошибка при создании материала');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('ru-RU');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Шапка */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Панель репетитора</h1>
            <p style={styles.subtitle}>Управление учебными материалами</p>
          </div>
          <a href="/register" style={styles.logoutLink}>
            ← Регистрация
          </a>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Форма добавления */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Добавить материал</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Название:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Например: Введение в Python"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Тип:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="TEXT">Текст</option>
                  <option value="LINK">Ссылка</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Содержимое {formData.type === 'LINK' ? '(URL)' : '(текст)'}:
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={4}
                style={{ ...styles.input, resize: 'vertical' }}
                placeholder={
                  formData.type === 'LINK'
                    ? 'https://example.com/material'
                    : 'Текст материала...'
                }
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                ID ученика (необязательно, оставь пустым для общего материала):
              </label>
              <input
                type="number"
                name="student_id"
                value={formData.student_id ?? ''}
                onChange={handleChange}
                style={styles.input}
                placeholder="Например: 1"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.buttonDisabled : styles.button}
            >
              {loading ? 'Отправка...' : 'Добавить материал'}
            </button>
          </form>
        </div>

        {/* Список материалов */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Мои материалы ({materials.length})
          </h2>

          {loading && materials.length === 0 && <p>Загрузка...</p>}

          {!loading && materials.length === 0 && (
            <p style={styles.empty}>Материалов пока нет. Добавь первый!</p>
          )}

          <div style={styles.list}>
            {materials.map((mat) => (
              <div key={mat.id} style={styles.materialItem}>
                <div style={styles.materialHeader}>
                  <span
                    style={
                      mat.type === 'LINK'
                        ? styles.badgeLink
                        : styles.badgeText
                    }
                  >
                    {mat.type === 'LINK' ? '🔗 Ссылка' : '📝 Текст'}
                  </span>
                  <span style={styles.date}>{formatDate(mat.created_at)}</span>
                </div>
                <h3 style={styles.materialTitle}>{mat.title}</h3>
                <div style={styles.materialContent}>
                  {mat.type === 'LINK' ? (
                    <a
                      href={mat.content}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      {mat.content}
                    </a>
                  ) : (
                    <span>{mat.content}</span>
                  )}
                </div>
                {mat.student_id && (
                  <div style={styles.studentBadge}>
                    👤 Ученик #{mat.student_id}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'system-ui, sans-serif',
    padding: '40px 20px',
  },
  wrapper: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    color: 'white',
  },
  title: {
    margin: 0,
    fontSize: '28px',
  },
  subtitle: {
    margin: '4px 0 0',
    opacity: 0.85,
    fontSize: '14px',
  },
  logoutLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '6px',
  },
  card: {
    background: 'white',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    marginBottom: '24px',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#333',
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  field: {
    flex: 1,
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
    fontFamily: 'inherit',
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
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  success: {
    background: '#efe',
    color: '#3a3',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    padding: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  materialItem: {
    border: '1px solid #eee',
    padding: '16px',
    borderRadius: '8px',
    background: '#fafafa',
  },
  materialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  badgeText: {
    background: '#e3f2fd',
    color: '#1976d2',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  badgeLink: {
    background: '#f3e5f5',
    color: '#7b1fa2',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  date: {
    fontSize: '12px',
    color: '#999',
  },
  materialTitle: {
    margin: '0 0 8px',
    fontSize: '17px',
    color: '#222',
  },
  materialContent: {
    color: '#555',
    fontSize: '14px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'underline',
  },
  studentBadge: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#666',
    background: '#f0f0f0',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'inline-block',
  },
};