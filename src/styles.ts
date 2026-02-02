export const styles = `/* CSS Variables */
:root {
  --bg-dark: #f5f1eb;
  --bg-card: #ffffff;
  --bg-card-hover: #f5f1eb;
  --primary: #5b4636;
  --primary-light: #7a6350;
  --accent: #c9a227;
  --success: #10b981;
  --danger: #ef4444;
  --text: #2c2416;
  --text-muted: #6b5d4d;
  --border: #e0d6c8;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.2);
  --radius: 16px;
  --radius-sm: 8px;
}

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

/* Container */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Navbar */
.navbar {
  background: var(--bg-card);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.nav-brand {
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text);
}

.nav-brand-icon {
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
}

.nav-link:hover {
  color: var(--text);
  background: var(--bg-card-hover);
}

.nav-link.active {
  color: var(--primary-light);
  background: rgba(99, 102, 241, 0.1);
}

/* Login Page */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 3rem;
}

.login-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.login-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 500px;
}

.member-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.member-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.member-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid var(--border);
  background: var(--bg-card-hover);
}

.member-card:hover .member-avatar {
  border-color: var(--primary);
}

.member-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

/* Password Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Forms */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #ffffff;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  color: var(--text);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}

textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-card-hover);
  color: var(--text);
}

.btn-secondary:hover {
  background: var(--border);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-block {
  width: 100%;
}

.btn-group {
  display: flex;
  gap: 0.75rem;
}

/* Alerts */
.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-muted);
}

/* Cards */
.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  text-decoration: none;
  color: var(--text);
  border: 1px solid var(--border);
}

.feature-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  flex-grow: 1;
}

.feature-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary-light);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 1rem;
  align-self: flex-start;
}

.feature-badge.locked {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

/* Question Cards */
.questions-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.question-text {
  display: block;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.question-card textarea {
  background: #ffffff;
  border: 2px solid var(--border);
  color: var(--text);
}

/* Rating Group */
.rating-group {
  display: flex;
  gap: 0.75rem;
}

.rating-option {
  cursor: pointer;
}

.rating-option input {
  display: none;
}

.rating-value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #ffffff;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text);
  transition: all 0.2s;
}

.rating-option input:checked + .rating-value {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.rating-option:hover .rating-value {
  border-color: var(--primary);
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* Locked Card */
.locked-card {
  max-width: 500px;
  margin: 4rem auto;
  background: var(--bg-card);
  padding: 3rem;
  border-radius: var(--radius);
  text-align: center;
  border: 1px solid var(--border);
}

.locked-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.locked-card h1 {
  margin-bottom: 1rem;
}

.locked-card p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

/* Wrapped Styles */
.wrapped-hero {
  text-align: center;
  padding: 3rem 1rem;
}

.wrapped-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.wrapped-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
}

.wrapped-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.wrapped-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.wrapped-question {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.wrapped-stat {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  border-radius: var(--radius-sm);
  color: white;
  margin-bottom: 1.5rem;
}

.stat-value {
  display: block;
  font-size: 3rem;
  font-weight: 800;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.wrapped-responses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.response {
  padding: 1rem;
  background: var(--bg-card-hover);
  border-radius: var(--radius-sm);
}

.response-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--primary-light);
  margin-bottom: 0.5rem;
}

.response-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.response-text {
  color: var(--text);
  line-height: 1.6;
}

.response-value {
  font-size: 1.25rem;
}

.wrapped-footer {
  text-align: center;
  padding: 3rem 1rem;
}

.wrapped-footer p {
  margin-bottom: 0.5rem;
  color: var(--text-muted);
}

.wrapped-signature {
  font-style: italic;
  color: var(--primary-light);
}

/* Admin Styles */
.admin-section {
  margin-bottom: 2rem;
}

.admin-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.admin-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.status-indicator {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.status-visible {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.status-hidden {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.admin-card > p {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

/* Completion Table */
.completion-table {
  width: 100%;
  border-collapse: collapse;
}

.completion-table th,
.completion-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.completion-table th {
  font-weight: 600;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.completion-table td {
  color: var(--text);
}

.progress-bar {
  width: 100px;
  height: 8px;
  background: var(--border);
  border-radius: 9999px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, #8b5cf6 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-complete {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.badge-pending {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

/* Book List */
.book-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.book-cover {
  width: 60px;
  height: 90px;
  background: var(--bg-dark);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.book-info {
  flex-grow: 1;
}

.book-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.book-author {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.book-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Member List */
.member-list {
  display: flex;
  gap: -0.5rem;
}

.member-list .member-avatar {
  width: 32px;
  height: 32px;
  margin-left: -8px;
  border: 2px solid var(--bg-card);
}

.member-list .member-avatar:first-child {
  margin-left: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .member-grid {
    grid-template-columns: 1fr;
  }

  .login-header h1 {
    font-size: 2rem;
  }

  .wrapped-title {
    font-size: 2rem;
  }

  .rating-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .completion-table {
    font-size: 0.875rem;
  }

  .progress-bar {
    width: 60px;
  }

  .btn-group {
    flex-direction: column;
  }
}`;
