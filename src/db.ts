export interface Member {
  username: string;
  display_name: string;
  avatar_url: string;
}

export interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: string | null;
}

export interface Answer {
  id: number;
  user_id: number;
  question_id: number;
  answer: string;
  created_at: string;
}

export interface AnswerWithUser extends Answer {
  display_name: string;
  username: string;
  avatar_url: string;
}

// Get all members for login page
export async function getAllMembers(db: D1Database): Promise<Member[]> {
  const result = await db.prepare(
    'SELECT username, display_name, avatar_url FROM users ORDER BY display_name'
  ).all<Member>();
  return result.results || [];
}

// Get all questions
export async function getQuestions(db: D1Database): Promise<Question[]> {
  const result = await db.prepare('SELECT * FROM questions ORDER BY id').all<Question>();
  return result.results || [];
}

// Get user's answers
export async function getUserAnswers(db: D1Database, userId: number): Promise<Answer[]> {
  const result = await db.prepare(
    'SELECT * FROM answers WHERE user_id = ? ORDER BY question_id'
  ).bind(userId).all<Answer>();
  return result.results || [];
}

// Save or update an answer
export async function saveAnswer(
  db: D1Database,
  userId: number,
  questionId: number,
  answer: string
): Promise<void> {
  await db.prepare(`
    INSERT INTO answers (user_id, question_id, answer)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, question_id)
    DO UPDATE SET answer = excluded.answer, created_at = CURRENT_TIMESTAMP
  `).bind(userId, questionId, answer).run();
}

// Get all answers for wrapped view
export async function getAllAnswers(db: D1Database): Promise<AnswerWithUser[]> {
  const result = await db.prepare(`
    SELECT a.*, u.display_name, u.username, u.avatar_url
    FROM answers a
    JOIN users u ON u.id = a.user_id
    ORDER BY a.question_id, u.display_name
  `).all<AnswerWithUser>();
  return result.results || [];
}

// Get a setting value
export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const result = await db.prepare(
    'SELECT value FROM settings WHERE key = ?'
  ).bind(key).first<{ value: string }>();
  return result?.value || null;
}

// Set a setting value
export async function setSetting(db: D1Database, key: string, value: string): Promise<void> {
  await db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).bind(key, value).run();
}

// Check if wrapped is visible
export async function isWrappedVisible(db: D1Database): Promise<boolean> {
  const value = await getSetting(db, 'wrapped_visible');
  return value === 'true';
}

// Toggle wrapped visibility
export async function toggleWrappedVisibility(db: D1Database): Promise<boolean> {
  const currentValue = await isWrappedVisible(db);
  const newValue = !currentValue;
  await setSetting(db, 'wrapped_visible', newValue.toString());
  return newValue;
}

// Book interface
export interface Book {
  id: number;
  title: string;
  author: string;
  cover_url: string | null;
  added_by: number;
  read_date: string | null;
  status: string;
  created_at: string;
}

export interface BookWithUser extends Book {
  added_by_name: string;
  added_by_avatar: string;
}

// Get all books
export async function getBooks(db: D1Database): Promise<BookWithUser[]> {
  const result = await db.prepare(`
    SELECT b.*, u.display_name as added_by_name, u.avatar_url as added_by_avatar
    FROM books b
    JOIN users u ON u.id = b.added_by
    ORDER BY b.id DESC
  `).all<BookWithUser>();
  return result.results || [];
}

// Get single book by ID
export async function getBookById(db: D1Database, id: number): Promise<BookWithUser | null> {
  const result = await db.prepare(`
    SELECT b.*, u.display_name as added_by_name, u.avatar_url as added_by_avatar
    FROM books b
    JOIN users u ON u.id = b.added_by
    WHERE b.id = ?
  `).bind(id).first<BookWithUser>();
  return result || null;
}

// Get books by user
export async function getBooksByUser(db: D1Database, username: string): Promise<Book[]> {
  const result = await db.prepare(`
    SELECT b.*
    FROM books b
    JOIN users u ON u.id = b.added_by
    WHERE u.username = ?
    ORDER BY b.id DESC
  `).bind(username).all<Book>();
  return result.results || [];
}

// Get user by username
export async function getUserByUsername(db: D1Database, username: string): Promise<Member | null> {
  const result = await db.prepare(
    'SELECT username, display_name, avatar_url FROM users WHERE username = ?'
  ).bind(username).first<Member>();
  return result || null;
}

// Get completion status for all users
export async function getCompletionStatus(db: D1Database): Promise<{ username: string; display_name: string; avatar_url: string; answered: number; total: number }[]> {
  const result = await db.prepare(`
    SELECT
      u.username,
      u.display_name,
      u.avatar_url,
      COUNT(a.id) as answered,
      (SELECT COUNT(*) FROM questions) as total
    FROM users u
    LEFT JOIN answers a ON a.user_id = u.id
    GROUP BY u.id
    ORDER BY u.display_name
  `).all<{ username: string; display_name: string; avatar_url: string; answered: number; total: number }>();
  return result.results || [];
}
