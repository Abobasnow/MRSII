# Демонстрация проекта SUNС Progress — спринт 1

Стек: FastAPI + SQLAlchemy + PostgreSQL + React (отдельная ветка).

---

## Подготовка за 5 минут до презентации

Запуск сервера:

uvicorn app.main:app --reload --port 8080

Ожидаемый вывод:

INFO:     Uvicorn running on http://127.0.0.1:8080
INFO:     Application startup complete.

Терминал с сервером не закрывать во время презентации.

Вкладки для открытия в браузере:

- Swagger UI: http://localhost:8080/docs
- Health-check: http://localhost:8080/health
- GitHub ветка: https://github.com/Abobasnow/MRSII/tree/sunc-backend

---

## Сценарий презентации

### Блок 1. Схема БД (1.5 минуты)

Открыть PyCharm → db/schema.sql.

Схема приведена к 3-й нормальной форме. 9 таблиц: роли, пользователи, курсы, темы, уроки, домашние задания, сдачи, сообщения, материалы.

Открыть ER-диаграмму (docs/images/er-diagram.png).

Ключевые решения:

- Роль — отдельная сущность через role_id, а не текстом.
- user_progress привязан к теме, а не к курсу напрямую — курс достаётся через topics.course_id, это убирает дублирование.
- homework_submissions фиксирует поток через course_id — при перепоступлении сдачи не смешиваются.

---

### Блок 2. PostgreSQL + pgAdmin (1 минута)

Открыть sunc_progress → Schemas → public → Tables.

Все таблицы развёрнуты в PostgreSQL 17.

Выполнить SQL:

SELECT * FROM roles;

Ожидаемый результат: 3 строки — ADMIN, TEACHER, STUDENT.

Роли хранятся как отдельные записи. Пользователи ссылаются на них через role_id.

---

### Блок 3. Подключение Python → PostgreSQL (30 секунд)

Во втором терминале (чтобы uvicorn не останавливать) выполнить:

python -c "from app.config import settings; from sqlalchemy import create_engine, text; e=create_engine(settings.DATABASE_URL); c=e.connect(); print('Ролей в БД:', c.execute(text('SELECT COUNT(*) FROM roles')).scalar())"

Ожидаемый вывод:

Ролей в БД: 3

Python-код подключается к PostgreSQL через SQLAlchemy и psycopg v3. Данные читаются напрямую.

---

### Блок 4. API-эндпоинты (2 минуты)

Открыть http://localhost:8080/docs.

FastAPI автоматически генерирует Swagger UI из кода. Все эндпоинты в одном месте.

Список эндпоинтов:

- GET / — корневой
- GET /health — health-check
- POST /api/auth/register — регистрация
- POST /api/auth/login — логин
- POST /api/materials — создать материал
- GET /api/materials — список материалов преподавателя
- GET /api/materials/student/{student_id} — материалы для студента

---

### Блок 5. Демо регистрации (1 минута)

В Swagger:

1. Найти POST /api/auth/register
2. Try it out
3. Вставить:

{
  "email": "demo@example.com",
  "password": "demo123",
  "full_name": "Demo User",
  "role_id": 3,
  "avatar_url": null
}

4. Execute

Ожидаемый результат: 201 Created + JSON с id.

Пароль хешируется через pbkdf2_sha256 — видно в логах терминала.

Строка в логах uvicorn:

INSERT INTO users (...) VALUES (...)
...
INFO: POST /api/auth/register HTTP/1.1 201 Created

---

### Блок 6. Демо логина (1 минута)

В Swagger:

1. Найти POST /api/auth/login
2. Try it out
3. Вставить:

{
  "email": "demo@example.com",
  "password": "demo123"
}

4. Execute

Ожидаемый результат: 200 OK + данные пользователя.

Логин проверяет email и пароль. Неверный пароль возвращает 401.

Продемонстрировать ошибку: пароль wrong → Execute → 401 Unauthorized с сообщением «Неверный email или пароль».

---

## Если что-то сломалось

### Сервер не запускается

Проверить, что venv активирован:

.venv\Scripts\activate

Проверить, что PostgreSQL работает:

sc query postgresql-x64-17

Перезапустить:

uvicorn app.main:app --reload --port 8080

### Порт 8080 занят

Запустить на другом порту:

uvicorn app.main:app --reload --port 8081

В Swagger открывать http://localhost:8081/docs.

### Ошибка «email already exists»

Использовать другой email — например, demo2@example.com.

### Ошибка на регистрации — колонки нет

Проверить в pgAdmin, что в users есть avatar_url:

SELECT column_name FROM information_schema.columns WHERE table_name = 'users';

Если нет — выполнить:

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);