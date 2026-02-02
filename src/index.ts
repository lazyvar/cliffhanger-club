import { Hono } from 'hono';
import {
  Env,
  User,
  authMiddleware,
  requireAuth,
  requireAdmin,
  verifyUser,
  createSession,
  deleteSession,
  setSessionCookie,
  clearSessionCookie,
} from './auth';
import {
  getAllMembers,
  getQuestions,
  getUserAnswers,
  saveAnswer,
  getAllAnswers,
  isWrappedVisible,
  toggleWrappedVisibility,
  getCompletionStatus,
} from './db';
import { loginPage } from './pages/login';
import { dashboardPage } from './pages/dashboard';
import { questionsPage } from './pages/questions';
import { wrappedPage, wrappedLockedPage } from './pages/wrapped';
import { adminPage } from './pages/admin';
import { styles } from './styles';
import { getCookie } from 'hono/cookie';

type Variables = {
  user?: User;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Serve CSS
app.get('/styles.css', (c) => {
  return c.text(styles, 200, { 'Content-Type': 'text/css' });
});

// Serve placeholder avatars (returns a simple SVG)
app.get('/avatars/:name', (c) => {
  const name = c.req.param('name').replace('.jpg', '');
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const initial = name.charAt(0).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${color}"/>
    <text x="100" y="120" font-family="system-ui, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
  </svg>`;

  return c.body(svg, 200, { 'Content-Type': 'image/svg+xml' });
});

// Apply auth middleware to all routes
app.use('*', authMiddleware());

// Home - dashboard or login
app.get('/', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/login');
  }

  const isAdmin = user.username === 'mack';
  const wrappedVisible = await isWrappedVisible(c.env.DB);

  return c.html(dashboardPage({ user, isAdmin, wrappedVisible }));
});

// Login page - shows member photos
app.get('/login', async (c) => {
  const user = c.get('user');
  if (user) {
    return c.redirect('/');
  }

  const members = await getAllMembers(c.env.DB);
  const selectedUser = c.req.query('user');
  const error = c.req.query('error');

  return c.html(loginPage(members, error || undefined, selectedUser));
});

// Handle login
app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const username = String(body.username || '').toLowerCase().trim();
  const password = String(body.password || '');

  if (!username || !password) {
    return c.redirect(`/login?user=${username}&error=Please enter your password`);
  }

  const user = await verifyUser(c.env.DB, username, password);

  if (!user) {
    return c.redirect(`/login?user=${username}&error=Incorrect password`);
  }

  const sessionId = await createSession(c.env.DB, user.id);
  setSessionCookie(c, sessionId);

  return c.redirect('/');
});

// Logout
app.get('/logout', async (c) => {
  const sessionId = getCookie(c, 'session');
  if (sessionId) {
    await deleteSession(c.env.DB, sessionId);
  }
  clearSessionCookie(c);
  return c.redirect('/login');
});

// Books page (placeholder for now)
app.get('/books', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const isAdmin = user.username === 'mack';

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Books - Cliffhanger Club</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-brand">
      <span class="nav-brand-icon">📚</span>
      Cliffhanger Club
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/books" class="nav-link active">Books</a>
      <a href="/wrapped" class="nav-link">Wrapped</a>
      ${isAdmin ? '<a href="/admin" class="nav-link">Admin</a>' : ''}
      <div class="nav-user">
        <img src="${user.avatar_url}" alt="${user.display_name}" class="nav-avatar">
        <a href="/logout" class="nav-link">Logout</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="page-header">
      <h1>Our Books</h1>
      <p>Books we've read and are planning to read</p>
    </div>

    <div class="locked-card">
      <div class="locked-icon">📖</div>
      <h1>Coming Soon</h1>
      <p>The books section is under construction. Check back soon!</p>
      <a href="/" class="btn btn-primary">Back to Dashboard</a>
    </div>
  </div>
</body>
</html>`);
});

// Wrapped questions page (requires auth)
app.get('/wrapped/questions', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const questions = await getQuestions(c.env.DB);
  const answers = await getUserAnswers(c.env.DB, user.id);
  const wrappedVisible = await isWrappedVisible(c.env.DB);
  const isAdmin = user.username === 'mack';

  return c.html(questionsPage(user, questions, answers, isAdmin, wrappedVisible));
});

// Save answers
app.post('/wrapped/questions', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const body = await c.req.parseBody();
  const questions = await getQuestions(c.env.DB);

  for (const question of questions) {
    const answer = body[`q_${question.id}`];
    if (answer && typeof answer === 'string' && answer.trim()) {
      await saveAnswer(c.env.DB, user.id, question.id, answer.trim());
    }
  }

  const answers = await getUserAnswers(c.env.DB, user.id);
  const wrappedVisible = await isWrappedVisible(c.env.DB);
  const isAdmin = user.username === 'mack';

  return c.html(questionsPage(user, questions, answers, isAdmin, wrappedVisible, true));
});

// Wrapped page (requires auth)
app.get('/wrapped', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const isAdmin = user.username === 'mack';
  const wrappedVisible = await isWrappedVisible(c.env.DB);

  if (!wrappedVisible) {
    return c.html(wrappedLockedPage(user, isAdmin));
  }

  const questions = await getQuestions(c.env.DB);
  const answers = await getAllAnswers(c.env.DB);

  return c.html(wrappedPage(user, questions, answers, isAdmin));
});

// Admin page (requires admin)
app.get('/admin', requireAuth(), requireAdmin(), async (c) => {
  const user = c.get('user')!;
  const wrappedVisible = await isWrappedVisible(c.env.DB);
  const completionStatus = await getCompletionStatus(c.env.DB);

  return c.html(adminPage(user, wrappedVisible, completionStatus));
});

// Toggle wrapped visibility
app.post('/admin/toggle-wrapped', requireAuth(), requireAdmin(), async (c) => {
  await toggleWrappedVisibility(c.env.DB);
  return c.redirect('/admin');
});

export default app;
