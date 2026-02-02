interface Member {
  username: string;
  display_name: string;
  avatar_url: string;
}

export function loginPage(members: Member[], error?: string, selectedUser?: string): string {
  const selectedMember = selectedUser ? members.find(m => m.username === selectedUser) : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Cliffhanger Club</title>
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="login-page">
    <div class="login-header">
      <img src="/images/logo.png" alt="Cliffhanger Club" class="login-logo">
      <h1 class="login-title">Cliffhanger Club</h1>
    </div>

    <div class="member-grid">
      ${members.map(member => `
        <img src="${member.avatar_url}" alt="${member.display_name}" class="member-avatar" onclick="selectMember('${member.username}')">
      `).join('')}
    </div>
  </div>

  ${selectedMember ? `
  <div class="modal-overlay" onclick="closeModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <img src="${selectedMember.avatar_url}" alt="${selectedMember.display_name}" class="modal-avatar">
        <div>
          <div class="modal-title">Welcome back, ${selectedMember.display_name}</div>
          <div class="modal-subtitle">Enter your password to continue</div>
        </div>
      </div>

      ${error ? `<div class="error">${error}</div>` : ''}

      <form method="POST" action="/login">
        <input type="hidden" name="username" value="${selectedMember.username}">
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required autofocus placeholder="Enter your password">
        </div>

        <div class="btn-group">
          <button type="button" class="btn btn-secondary" onclick="window.location.href='/login'">Back</button>
          <button type="submit" class="btn btn-primary" style="flex: 1">Sign In</button>
        </div>
      </form>
    </div>
  </div>
  ` : ''}

  <script>
    function selectMember(username) {
      window.location.href = '/login?user=' + username;
    }

    function closeModal(event) {
      if (event.target.classList.contains('modal-overlay')) {
        window.location.href = '/login';
      }
    }

    // Focus password field if modal is open
    document.addEventListener('DOMContentLoaded', function() {
      const passwordInput = document.getElementById('password');
      if (passwordInput) {
        passwordInput.focus();
      }
    });
  </script>
</body>
</html>`;
}
