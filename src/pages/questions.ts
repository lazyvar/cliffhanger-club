import { Question, Answer } from '../db';
import { User } from '../auth';

export function questionsPage(
  user: User,
  questions: Question[],
  answers: Answer[],
  isAdmin: boolean,
  wrappedVisible: boolean,
  success?: boolean
): string {
  const answerMap = new Map(answers.map(a => [a.question_id, a.answer]));

  const renderQuestion = (q: Question) => {
    const currentAnswer = answerMap.get(q.id) || '';

    if (q.question_type === 'rating') {
      return `
        <div class="question-card">
          <label class="question-text">${q.question_text}</label>
          <div class="rating-group">
            ${[1, 2, 3, 4, 5].map(n => `
              <label class="rating-option">
                <input type="radio" name="q_${q.id}" value="${n}" ${currentAnswer === String(n) ? 'checked' : ''}>
                <span class="rating-value">${n}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (q.question_type === 'multiple_choice' && q.options) {
      const options = JSON.parse(q.options) as string[];
      return `
        <div class="question-card">
          <label class="question-text">${q.question_text}</label>
          <div class="choice-group">
            ${options.map(opt => `
              <label class="choice-option">
                <input type="radio" name="q_${q.id}" value="${opt}" ${currentAnswer === opt ? 'checked' : ''}>
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="question-card">
        <label class="question-text" for="q_${q.id}">${q.question_text}</label>
        <textarea id="q_${q.id}" name="q_${q.id}" rows="3" placeholder="Your answer...">${currentAnswer}</textarea>
      </div>
    `;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year in Review - Cliffhanger Club</title>
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
      <a href="/wrapped" class="nav-link active">Wrapped</a>
      ${isAdmin ? '<a href="/admin" class="nav-link">Admin</a>' : ''}
      <div class="nav-user">
        <img src="${user.avatar_url}" alt="${user.display_name}" class="nav-avatar">
        <a href="/logout" class="nav-link">Logout</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="page-header">
      <h1>Your Year in Review</h1>
      <p>Answer these questions to contribute to our book club wrapped!</p>
    </div>

    ${success ? '<div class="success">Your answers have been saved!</div>' : ''}

    <form method="POST" action="/wrapped/questions" class="questions-form">
      ${questions.map(renderQuestion).join('')}

      <div class="form-actions">
        <a href="/" class="btn btn-secondary">Back to Dashboard</a>
        <button type="submit" class="btn btn-primary">Save Answers</button>
      </div>
    </form>
  </div>
</body>
</html>`;
}
