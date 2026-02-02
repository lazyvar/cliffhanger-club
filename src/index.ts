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
  getBooks,
  getBookById,
  getBooksByUser,
  getUserByUsername,
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

// Serve CSS (static assets like images are served automatically from public/)
app.get('/styles.css', (c) => {
  return c.text(styles, 200, { 'Content-Type': 'text/css' });
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

// Books page
app.get('/books', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const isAdmin = user.username === 'mack';
  const books = await getBooks(c.env.DB);

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Books - Cliffhanger Club</title>
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <nav class="navbar">
    <a href="/" class="nav-brand">
      <img src="/images/logo.png" alt="Cliffhanger Club" class="nav-logo">
    </a>
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
      <p>${books.length} books read together</p>
    </div>

    <div class="books-list">
      ${books.map(book => `
        <div class="book-card-wrapper">
          <a href="/books/${book.id}" class="book-card">
            <div class="book-info">
              <div class="book-title">${book.title}</div>
              <div class="book-author">${book.author}</div>
            </div>
          </a>
          <a href="/profile/${book.added_by_name.toLowerCase()}" class="book-picker">
            <img src="${book.added_by_avatar}" alt="${book.added_by_name}" class="book-picker-avatar">
          </a>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`);
});

// Book detail page
app.get('/books/:id', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const isAdmin = user.username === 'mack';
  const bookId = parseInt(c.req.param('id'));
  const book = await getBookById(c.env.DB, bookId);

  if (!book) {
    return c.redirect('/books');
  }

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${book.title} - Cliffhanger Club</title>
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <nav class="navbar">
    <a href="/" class="nav-brand">
      <img src="/images/logo.png" alt="Cliffhanger Club" class="nav-logo">
    </a>
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
    <a href="/books" class="back-link">← Back to Books</a>

    <div class="book-detail">
      <h1 class="book-detail-title">${book.title}</h1>
      <p class="book-detail-author">by ${book.author}</p>

      <a href="/profile/${book.added_by_name.toLowerCase()}" class="book-detail-picker">
        <img src="${book.added_by_avatar}" alt="${book.added_by_name}" class="book-detail-avatar">
        <span>Picked by ${book.added_by_name}</span>
      </a>
    </div>
  </div>
</body>
</html>`);
});

// Profile page
app.get('/profile/:username', requireAuth(), async (c) => {
  const user = c.get('user')!;
  const isAdmin = user.username === 'mack';
  const username = c.req.param('username').toLowerCase();
  const profile = await getUserByUsername(c.env.DB, username);

  if (!profile) {
    return c.redirect('/');
  }

  const picks = await getBooksByUser(c.env.DB, username);

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.display_name} - Cliffhanger Club</title>
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <nav class="navbar">
    <a href="/" class="nav-brand">
      <img src="/images/logo.png" alt="Cliffhanger Club" class="nav-logo">
    </a>
    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/books" class="nav-link">Books</a>
      <a href="/wrapped" class="nav-link">Wrapped</a>
      ${isAdmin ? '<a href="/admin" class="nav-link">Admin</a>' : ''}
      <div class="nav-user">
        <img src="${user.avatar_url}" alt="${user.display_name}" class="nav-avatar">
        <a href="/logout" class="nav-link">Logout</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="profile-header">
      <img src="${profile.avatar_url}" alt="${profile.display_name}" class="profile-avatar">
      <h1 class="profile-name">${profile.display_name}</h1>
      <p class="profile-stats">${picks.length} book${picks.length !== 1 ? 's' : ''} picked</p>
    </div>

    ${picks.length > 0 ? `
    <div class="profile-section">
      <h2>Picks</h2>
      <div class="books-list">
        ${picks.map(book => `
          <a href="/books/${book.id}" class="book-card">
            <div class="book-info">
              <div class="book-title">${book.title}</div>
              <div class="book-author">${book.author}</div>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
    ` : `
    <p class="profile-empty">No picks yet</p>
    `}
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
