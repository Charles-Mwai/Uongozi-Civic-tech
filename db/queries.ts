import { sql } from 'drizzle-orm';
import { db } from './index.js';
import { userScores, questions, questionOptions, questionResponses, quizzes } from './schema.js';
import { and, eq, gte, lte, desc, inArray } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

type QuestionWithRelations = InferSelectModel<typeof questions> & {
  options: InferSelectModel<typeof questionOptions>[];
  responses: InferSelectModel<typeof questionResponses>[];
};

type QuizWithRelations = InferSelectModel<typeof quizzes> & {
  questions: QuestionWithRelations[];
};

type UserScoreWithQuiz = InferSelectModel<typeof userScores> & {
  quiz: InferSelectModel<typeof quizzes> | null;
};

type SaveScoreParams = {
  ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65-70' | '71+';
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  score: number;
  sessionId: string;
  quizId?: string;
  timeSpentSeconds?: number;
};

export async function saveScore(scoreData: SaveScoreParams) {
  const values = {
    session_id: scoreData.sessionId,
    age_group: scoreData.ageGroup as any, // Type assertion needed for enum
    gender: scoreData.gender as any, // Type assertion needed for enum
    score: scoreData.score.toString(),
    quiz_id: scoreData.quizId,
    time_spent_seconds: scoreData.timeSpentSeconds ?? 0,
  };
  
  console.log('Saving score with values:', values);
  
  try {
    const result = await db.insert(userScores)
      .values(values as any) // Type assertion to bypass type checking
      .returning();
    return result;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}

export async function getScoreStats() {
  return db.select({
    ageGroup: userScores.age_group,
    gender: userScores.gender,
    count: sql<number>`count(*)`,
    average: sql<number>`avg(${userScores.score}::numeric)`,
    min: sql<number>`min(${userScores.score}::numeric)`,
    max: sql<number>`max(${userScores.score}::numeric)`,
  })
  .from(userScores)
  .groupBy(userScores.age_group, userScores.gender);
}

export async function getScoreDistribution() {
  return db.select({
    score: sql<number>`ROUND(${userScores.score}::numeric, 0)::int`,
    count: sql<number>`count(*)`,
  })
  .from(userScores)
  .groupBy(sql`ROUND(${userScores.score}::numeric, 0)::int`)
  .orderBy(sql`ROUND(${userScores.score}::numeric, 0)::int`);
}

export async function getScoresByDate() {
  return db.select({
    date: sql<string>`to_char(${userScores.completed_at}, 'YYYY-MM-DD')`,
    count: sql<number>`count(*)`,
    average: sql<number>`avg(${userScores.score}::numeric)`,
  })
  .from(userScores)
  .groupBy(sql`to_char(${userScores.completed_at}, 'YYYY-MM-DD')`)
  .orderBy(sql`to_char(${userScores.completed_at}, 'YYYY-MM-DD')`);
}



export async function getQuizResults(quizId: string): Promise<QuizWithRelations | undefined> {
  // Find the quiz
  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, quizId)
  });

  if (!quiz) return undefined;

  // Find related questions
  const quizQuestions = await db.query.questions.findMany({
    where: eq(questions.quiz_id, quizId)
  });

  // Find options and responses for each question
  const questionsWithRelations = await Promise.all(
    quizQuestions.map(async (question: InferSelectModel<typeof questions>) => {
      const [options, responses] = await Promise.all([
        db.query.questionOptions.findMany({
          where: eq(questionOptions.question_id, question.id)
        }),
        db.query.questionResponses.findMany({
          where: eq(questionResponses.question_id, question.id)
        })
      ]);

      return {
        ...question,
        options,
        responses
      };
    })
  );

  return {
    ...quiz,
    questions: questionsWithRelations
  };
}

export async function saveQuestionResponse(params: {
  sessionId: string;
  questionId: string;
  optionId?: string;
  responseText?: string;
  isCorrect: boolean;
  pointsEarned: number;
}) {
  return db.insert(questionResponses).values({
    session_id: params.sessionId,
    question_id: params.questionId,
    option_id: params.optionId || null,
    response_text: params.responseText || null,
    is_correct: params.isCorrect,
    points_earned: params.pointsEarned?.toString() || '0',
  }).returning();
}

export async function getUserQuizResults(sessionId: string): Promise<UserScoreWithQuiz[]> {
  const scores = await db.query.userScores.findMany({
    where: eq(userScores.session_id, sessionId),
    orderBy: [desc(userScores.completed_at)]
  });

  // Get unique quiz IDs
  const quizIds = new Set<string>();
  for (const score of scores) {
    if (score.quiz_id) {
      quizIds.add(score.quiz_id);
    }
  }
  
  // Fetch all related quizzes in one query
  const quizMap = new Map<string, InferSelectModel<typeof quizzes>>();
  if (quizIds.size > 0) {
    const quizList = Array.from(quizIds);
    const quizResults = await db.query.quizzes.findMany({
      where: (table: any, { inArray }: any) => inArray(table.id, quizList)
    });
    
    for (const quiz of quizResults) {
      if (quiz) {
        quizMap.set(quiz.id, quiz);
      }
    }
  }

  // Combine scores with their quizzes
  return scores.map((score: InferSelectModel<typeof userScores>) => ({
    ...score,
    quiz: score.quiz_id ? quizMap.get(score.quiz_id) || null : null
  }));
}
