import { Question, AnswerWithUser } from '../db';
import { User } from '../auth';

export function wrappedPage(
  user: User,
  questions: Question[],
  answers: AnswerWithUser[],
  isAdmin: boolean
): string {
  const answersByQuestion = new Map<number, AnswerWithUser[]>();

  for (const answer of answers) {
    if (!answersByQuestion.has(answer.question_id)) {
      answersByQuestion.set(answer.question_id, []);
    }
    answersByQuestion.get(answer.question_id)!.push(answer);
  }

  const renderQuestionResults = (q: Question) => {
    const questionAnswers = answersByQuestion.get(q.id) || [];

    if (q.question_type === 'rating') {
      const ratings = questionAnswers.map(a => parseInt(a.answer)).filter(n => !isNaN(n));
      const average = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';

      return `
        <div class="wrapped-card">
          <h3 class="wrapped-question">${q.question_text}</h3>
          <div class="wrapped-stat">
            <span class="stat-value">${average}</span>
            <span class="stat-label">Average Rating</span>
          </div>
          <div class="wrapped-responses">
            ${questionAnswers.map(a => `
              <div class="response">
                <span class="response-author">
                  <img src="${a.avatar_url}" alt="${a.display_name}" class="response-avatar">
                  ${a.display_name}
                </span>
                <span class="response-value">${'⭐'.repeat(parseInt(a.answer))}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="wrapped-card">
        <h3 class="wrapped-question">${q.question_text}</h3>
        <div class="wrapped-responses">
          ${questionAnswers.map(a => `
            <div class="response">
              <span class="response-author">
                <img src="${a.avatar_url}" alt="${a.display_name}" class="response-avatar">
                ${a.display_name}
              </span>
              <p class="response-text">${a.answer}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2024 Wrapped - Cliffhanger Club</title>
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
      <a href="/wrapped" class="nav-link active">Wrapped</a>
      ${isAdmin ? '<a href="/admin" class="nav-link">Admin</a>' : ''}
      <div class="nav-user">
        <img src="${user.avatar_url}" alt="${user.display_name}" class="nav-avatar">
        <a href="/logout" class="nav-link">Logout</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="wrapped-hero">
      <h1 class="wrapped-title">📚 2024 Wrapped 📚</h1>
      <p class="wrapped-subtitle">Your Cliffhanger Club Year in Review</p>
    </div>

    <div class="wrapped-grid">
      ${questions.map(renderQuestionResults).join('')}
    </div>

    <div class="wrapped-footer">
      <p>Thanks for a great year of reading together!</p>
      <p class="wrapped-signature">— Cliffhanger Club</p>
    </div>
  </div>
</body>
</html>`;
}

export function wrappedLockedPage(user: User, isAdmin: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wrapped - Cliffhanger Club</title>
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
      <a href="/wrapped" class="nav-link active">Wrapped</a>
      ${isAdmin ? '<a href="/admin" class="nav-link">Admin</a>' : ''}
      <div class="nav-user">
        <img src="${user.avatar_url}" alt="${user.display_name}" class="nav-avatar">
        <a href="/logout" class="nav-link">Logout</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="locked-card">
      <div class="locked-icon">🔒</div>
      <h1>Wrapped is Coming Soon!</h1>
      <p>The year in review will be revealed once everyone has answered and the admin unlocks it.</p>
      <a href="/wrapped/questions" class="btn btn-primary">Answer Questions</a>
    </div>
  </div>
</body>
</html>`;
}
