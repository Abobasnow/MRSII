-- 1. Роли
CREATE TABLE roles (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Пользователи
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    full_name  VARCHAR(255),
    role_id    INT NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Курсы
CREATE TABLE courses (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id  BIGINT REFERENCES users(id),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Темы курса
CREATE TABLE topics (
    id          BIGSERIAL PRIMARY KEY,
    course_id   BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    order_index INT NOT NULL DEFAULT 0
);

-- 5. Прогресс пользователя
CREATE TABLE user_progress (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id   BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    status     VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
    score      INT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, topic_id)
);

-- 6. Уроки
CREATE TABLE lessons (
    id                   BIGSERIAL PRIMARY KEY,
    topic_id             BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title                VARCHAR(255) NOT NULL,
    content              TEXT,
    video_url            VARCHAR(500),
    order_index          INT NOT NULL DEFAULT 0,
    homework_title       VARCHAR(255),
    homework_description TEXT,
    due_date             TIMESTAMP
);

-- 7. Сдачи домашних заданий
CREATE TABLE homework_submissions (
    id                 BIGSERIAL PRIMARY KEY,
    homework_lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    student_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id          BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    answer_text        TEXT,
    file_url           VARCHAR(500),
    status             VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    grade              INT,
    submitted_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (homework_lesson_id, student_id, course_id)
);

-- 8. Сообщения
CREATE TABLE messages (
    id          BIGSERIAL PRIMARY KEY,
    sender_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body        TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_messages_dialog ON messages(sender_id, receiver_id, created_at);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_homework_submissions_student ON homework_submissions(student_id, course_id);

-- Начальные роли
INSERT INTO roles (name) VALUES
('ADMIN'),
('TEACHER'),
('STUDENT');
