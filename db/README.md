# Database Documentation

This directory contains the database schema, migrations, and queries for the Civic Education Platform.

## Schema Overview

### Tables

1. **quizzes**
   - Stores quiz metadata (title, description, passing score, etc.)
   - Related to: questions (one-to-many)

2. **questions**
   - Stores quiz questions with their type and point values
   - Related to: quizzes (many-to-one), question_options (one-to-many), question_responses (one-to-many)

3. **question_options**
   - Stores multiple choice options for questions
   - Related to: questions (many-to-one), question_responses (one-to-many)

4. **user_scores**
   - Tracks user quiz attempts with demographic information
   - Related to: quizzes (many-to-one)

5. **question_responses**
   - Records individual question responses
   - Related to: questions (many-to-one), question_options (many-to-one)

## Migrations

Migrations are stored in the `migrations` directory and are applied in order. Each migration file is named with a sequential number and a descriptive name.

### Applying Migrations

To apply migrations, run:

```bash
node scripts/apply-migration.js
```

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
DATABASE_URL=postgres://username:password@host:port/database
NODE_ENV=development
```

## Query Examples

### Save a quiz score

```typescript
import { saveScore } from './queries';

const result = await saveScore({
  ageGroup: '25-34',
  gender: 'male',
  score: 85.5,
  sessionId: 'session-123',
  quizId: 'uuid-here',
  timeSpentSeconds: 300
});
```

### Get quiz results

```typescript
import { getQuizResults } from './queries';

const quiz = await getQuizResults('quiz-uuid');
if (quiz) {
  console.log(`Quiz: ${quiz.title}`);
  console.log(`Questions: ${quiz.questions.length}`);
}
```

### Get user's quiz history

```typescript
import { getUserQuizResults } from './queries';

const userScores = await getUserQuizResults('session-123');
userScores.forEach(score => {
  console.log(`Score: ${score.score}, Quiz: ${score.quiz?.title}`);
});
```

## Schema Diagram

```mermaid
erDiagram
    quizzes ||--o{ questions : contains
    questions }|--|| quizzes : quiz
    questions ||--o{ question_options : has
    question_options }|--|| questions : question
    user_scores }o--|| quizzes : quiz
    question_responses }o--|| questions : question
    question_responses }o--|| question_options : option
```
