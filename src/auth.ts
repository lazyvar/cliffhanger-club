import { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_url: string;
}

export interface Env {
  DB: D1Database;
}

// Hash password with username as salt using SHA-256
export async function hashPassword(username: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${username}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate a random session ID
export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify user credentials
export async function verifyUser(db: D1Database, username: string, password: string): Promise<User | null> {
  const passwordHash = await hashPassword(username, password);

  const user = await db.prepare(
    'SELECT id, username, display_name, avatar_url FROM users WHERE username = ? AND password_hash = ?'
  ).bind(username, passwordHash).first<User>();

  return user || null;
}

// Create a new session
export async function createSession(db: D1Database, userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, userId, expiresAt).run();

  return sessionId;
}

// Get user from session
export async function getUserFromSession(db: D1Database, sessionId: string): Promise<User | null> {
  const result = await db.prepare(`
    SELECT u.id, u.username, u.display_name, u.avatar_url
    FROM users u
    JOIN sessions s ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).bind(sessionId).first<User>();

  return result || null;
}

// Delete session
export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

// Clean up expired sessions
export async function cleanupExpiredSessions(db: D1Database): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run();
}

// Auth middleware - adds user to context if authenticated
export function authMiddleware() {
  return async (c: Context<{ Bindings: Env; Variables: { user?: User } }>, next: Next) => {
    const sessionId = getCookie(c, 'session');

    if (sessionId) {
      const user = await getUserFromSession(c.env.DB, sessionId);
      if (user) {
        c.set('user', user);
      }
    }

    await next();
  };
}

// Require auth middleware - redirects to login if not authenticated
export function requireAuth() {
  return async (c: Context<{ Bindings: Env; Variables: { user?: User } }>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.redirect('/login');
    }

    await next();
  };
}

// Require admin middleware - requires mack user
export function requireAdmin() {
  return async (c: Context<{ Bindings: Env; Variables: { user?: User } }>, next: Next) => {
    const user = c.get('user');

    if (!user || user.username !== 'mack') {
      return c.text('Unauthorized', 403);
    }

    await next();
  };
}

// Set session cookie
export function setSessionCookie(c: Context, sessionId: string) {
  setCookie(c, 'session', sessionId, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// Clear session cookie
export function clearSessionCookie(c: Context) {
  deleteCookie(c, 'session', { path: '/' });
}
