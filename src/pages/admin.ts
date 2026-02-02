import { User } from '../auth';

interface CompletionStatus {
  username: string;
  display_name: string;
  avatar_url: string;
  answered: number;
  total: number;
}

export function adminPage(
  user: User,
  wrappedVisible: boolean,
  completionStatus: CompletionStatus[]
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Cliffhanger Club</title>
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
      <a href="/books" class="nav-link">Books</a>
      <a href="/wrapped" class="nav-link">Wrapped</a>
      <a href="/admin" class="nav-link active">Admin</a>
      <div class="nav-user">
        <img src="${user.avatar_url}" alt="${user.display_name}" class="nav-avatar">
        <a href="/logout" class="nav-link">Logout</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="page-header">
      <h1>Admin Panel</h1>
      <p>Manage your book club settings</p>
    </div>

    <div class="admin-section">
      <h2>Wrapped Visibility</h2>
      <div class="admin-card">
        <div class="status-indicator ${wrappedVisible ? 'status-visible' : 'status-hidden'}">
          ${wrappedVisible ? '🟢 Visible' : '🔴 Hidden'}
        </div>
        <p>The wrapped summary is currently <strong>${wrappedVisible ? 'visible' : 'hidden'}</strong> to all members.</p>
        <form method="POST" action="/admin/toggle-wrapped">
          <button type="submit" class="btn ${wrappedVisible ? 'btn-danger' : 'btn-success'}">
            ${wrappedVisible ? 'Hide Wrapped' : 'Reveal Wrapped'}
          </button>
        </form>
      </div>
    </div>

    <div class="admin-section">
      <h2>Member Progress</h2>
      <div class="admin-card">
        <table class="completion-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${completionStatus.map(status => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${status.avatar_url}" alt="${status.display_name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                    ${status.display_name}
                  </div>
                </td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${status.total > 0 ? (status.answered / status.total * 100) : 0}%"></div>
                  </div>
                  <span class="progress-text">${status.answered}/${status.total}</span>
                </td>
                <td>
                  ${status.answered === status.total && status.total > 0
                    ? '<span class="badge badge-complete">Complete</span>'
                    : '<span class="badge badge-pending">Pending</span>'
                  }
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;
}
