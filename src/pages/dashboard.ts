import { User } from '../auth';

interface DashboardProps {
  user: User;
  isAdmin: boolean;
  wrappedVisible: boolean;
}

export function dashboardPage({ user, isAdmin, wrappedVisible }: DashboardProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Cliffhanger Club</title>
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <nav class="navbar">
    <a href="/" class="nav-brand">
      <img src="/images/logo.png" alt="Cliffhanger Club" class="nav-logo">
    </a>
    <div class="nav-links">
      <a href="/" class="nav-link active">Home</a>
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
    <div class="page-header">
      <h1>Welcome back, ${user.display_name}!</h1>
      <p>What would you like to do today?</p>
    </div>

    <div class="dashboard-grid">
      <a href="/books" class="feature-card">
        <div class="feature-icon">📖</div>
        <div class="feature-title">Our Books</div>
        <div class="feature-desc">Browse the books we've read and are planning to read together.</div>
        <span class="feature-badge">Browse</span>
      </a>

      <a href="/wrapped/questions" class="feature-card">
        <div class="feature-icon">✍️</div>
        <div class="feature-title">Year in Review</div>
        <div class="feature-desc">Answer questions about your favorite reads and memorable moments this year.</div>
        <span class="feature-badge">Answer Questions</span>
      </a>

      <a href="/wrapped" class="feature-card">
        <div class="feature-icon">🎁</div>
        <div class="feature-title">2024 Wrapped</div>
        <div class="feature-desc">See everyone's answers and celebrate our year of reading together.</div>
        <span class="feature-badge ${wrappedVisible ? '' : 'locked'}">${wrappedVisible ? 'View Now' : 'Coming Soon'}</span>
      </a>

      ${isAdmin ? `
      <a href="/admin" class="feature-card">
        <div class="feature-icon">⚙️</div>
        <div class="feature-title">Admin Panel</div>
        <div class="feature-desc">Manage the book club, toggle wrapped visibility, and view member progress.</div>
        <span class="feature-badge">Manage</span>
      </a>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}
