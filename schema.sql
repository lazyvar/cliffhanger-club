-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '/avatars/default.jpg'
);

-- Questions table
CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'text', -- text, multiple_choice, rating
  options TEXT -- JSON array for multiple choice
);

-- Answers table
CREATE TABLE answers (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  UNIQUE(user_id, question_id)
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Settings table (for admin controls)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Books table
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  added_by INTEGER,
  read_date TEXT,
  status TEXT DEFAULT 'upcoming', -- upcoming, reading, completed
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id)
);

-- Initialize settings
INSERT INTO settings (key, value) VALUES ('wrapped_visible', 'false');
