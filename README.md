```markdown
# SUNС Progress

Платформа онлайн-обучения: курсы, уроки, домашние задания, чат между студентами и преподавателями.

**Стек:** FastAPI + SQLAlchemy + PostgreSQL, фронт — React + Vite + TypeScript.

---

## Содержание

- [Что это](#что-это)
- [Стек](#стек)
- [Структура проекта](#структура-проекта)
- [Схема базы данных](#схема-базы-данных)

---

## Что это

SUNС Progress — учебная платформа для организации онлайн-обучения:

- **Студенты** — записываются на курсы, изучают уроки, сдают домашние задания, отслеживают прогресс.
- **Преподаватели** — создают курсы, темы, уроки, проверяют ДЗ, оставляют материалы.
- **Администраторы** — управляют пользователями и ролями.

Проект разрабатывается в рамках спринта. Текущий статус — **спринт 1**: базовая инфраструктура и API авторизации.

---

## Стек

### Backend

- **Python 3.14** (managed через Python Install Manager)
- **FastAPI** — веб-фреймворк
- **SQLAlchemy 2.1** — ORM
- **psycopg 3** — драйвер PostgreSQL
- **Pydantic v2** — валидация данных
- **passlib[bcrypt]** — хеширование паролей
- **python-jose** — работа с JWT (в бэклоге)
- **Uvicorn** — ASGI-сервер

### База данных

- **PostgreSQL 17**
- 9 таблиц: `roles`, `users`, `courses`, `topics`, `user_progress`, `lessons`, `homework_submissions`, `messages`, `materials`

### Инструменты

- **Git** + **GitHub**
- **PyCharm** / **VS Code**
- **pgAdmin 4** / **Database tool в PyCharm**
- **Kaiten** — управление задачами

---

## Структура проекта
sunc-backend/
├── app/
│ ├── init.py
│ ├── main.py # точка входа FastAPI
│ ├── config.py # настройки из .env
│ ├── database.py # SQLAlchemy engine + сессии
│ ├── models/ # SQLAlchemy-модели
│ │ ├── init.py
│ │ ├── user.py # User + Role
│ │ └── material.py # Material
│ ├── schemas/ # Pydantic-схемы (DTO)
│ │ ├── init.py
│ │ ├── user.py
│ │ └── material.py
│ ├── repositories/ # слой доступа к данным (в бэклоге)
│ ├── routers/ # эндпоинты
│ │ ├── init.py
│ │ ├── auth.py # /api/auth/register, /api/auth/login
│ │ └── materials.py # /api/materials
│ └── security/
│ ├── init.py
│ └── utils.py # хеширование паролей
├── db/
│ └── schema.sql # SQL-скрипт создания схемы БД
├── .env # секреты (НЕ коммитится)
├── .gitignore
├── requirements.txt
└── README.md

---

## Схема базы данных

9 таблиц, приведены к 3-й нормальной форме.
![ER-диаграмма базы данных](docs/images/er-diagram.png)

### Связи

- `roles 1 → * users`
- `users 1 → * courses` (teacher_id)
- `users 1 → * user_progress`
- `users 1 → * homework_submissions`
- `users 1 → * materials` (teacher_id, student_id)
- `users 1 → * messages` (sender_id, receiver_id)
- `courses 1 → * topics`
- `courses 1 → * homework_submissions`
- `topics 1 → * user_progress`
- `topics 1 → * lessons`
- `lessons 1 → * homework_submissions`

### Особенности

- **Роль — отдельная сущность** через `role_id (FK → roles.id)`.
- **`user_progress`** привязан к `topic_id`, не хранит `course_id` — курс достаётся через `topics.course_id` (3НФ).
- **`homework_submissions`** фиксирует поток через `course_id` — перепоступления не смешиваются.
- Все FK с `ON DELETE CASCADE` где нужно.
- `UNIQUE`-ограничения защищают от дублей.

Полная схема — в [`db/schema.sql`](db/schema.sql).

---


## Контакты

- **Репозиторий:** [github.com/Abobasnow/MRSII](https://github.com/Abobasnow/MRSII)
- **Проект:** SUNС Progress, ПМИ
