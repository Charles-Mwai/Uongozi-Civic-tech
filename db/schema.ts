import { pgTable, varchar, timestamp, uuid, integer, decimal, text, boolean, pgSchema, index, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Helper type for age groups
type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65-70' | '71+';

// Helper type for gender
type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Helper type for question types
type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

// User scores table
export const userScores = pgTable('user_scores', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    session_id: varchar('session_id', { length: 100 }).notNull(),
    age_group: varchar('age_group', { length: 10 })
      .notNull()
      .$type<AgeGroup>()
      .default('18-24'),
    gender: varchar('gender', { length: 20 })
      .notNull()
      .$type<Gender>()
      .default('prefer_not_to_say'),
    score: decimal('score', { precision: 5, scale: 2 })
        .notNull()
        .default(sql`0`)
        .$type<number>(),
    quiz_id: uuid('quiz_id'),
    time_spent_seconds: integer('time_spent_seconds')
      .notNull()
      .default(0),
    completed_at: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Quizzes table
export const quizzes = pgTable('quizzes', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    passing_score: decimal('passing_score', { precision: 5, scale: 2 }).default(sql`70.00`),
    time_limit_minutes: integer('time_limit_minutes'),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Questions table
export const questions = pgTable('questions', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    quiz_id: uuid('quiz_id').notNull()
        .references(() => quizzes.id, { onDelete: 'cascade' }),
    question_text: text('question_text').notNull(),
    question_type: varchar('question_type', { length: 20 })
      .notNull()
      .$type<QuestionType>()
      .default('multiple_choice'),
    points: integer('points').notNull().default(1),
    order_index: integer('order_index').notNull(),
    correct_answer: text('correct_answer'),
    explanation: text('explanation'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    quizOrderPk: primaryKey({
      columns: [table.quiz_id, table.order_index],
      name: 'quiz_order_pk'
    })
}));

// Question options table
export const questionOptions = pgTable('question_options', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    question_id: uuid('question_id').notNull()
        .references(() => questions.id, { onDelete: 'cascade' }),
    option_text: text('option_text').notNull(),
    is_correct: boolean('is_correct').notNull().default(false),
    order_index: integer('order_index').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    questionOrderPk: primaryKey({
      columns: [table.question_id, table.order_index],
      name: 'question_order_pk'
    })
}));

// Question responses table
export const questionResponses = pgTable('question_responses', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    session_id: varchar('session_id', { length: 100 }).notNull(),
    question_id: uuid('question_id').notNull()
        .references(() => questions.id, { onDelete: 'cascade' }),
    option_id: uuid('option_id')
        .references(() => questionOptions.id, { onDelete: 'set null' }),
    response_text: text('response_text'),
    is_correct: boolean('is_correct'),
    points_earned: decimal('points_earned', { precision: 5, scale: 2 })
      .notNull()
      .default(sql`0`),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// Types for TypeScript
export type UserScore = typeof userScores.$inferSelect;
export type NewUserScore = typeof userScores.$inferInsert;
export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type QuestionOption = typeof questionOptions.$inferSelect;
export type NewQuestionOption = typeof questionOptions.$inferInsert;
export type QuestionResponse = typeof questionResponses.$inferSelect;
export type NewQuestionResponse = typeof questionResponses.$inferInsert;