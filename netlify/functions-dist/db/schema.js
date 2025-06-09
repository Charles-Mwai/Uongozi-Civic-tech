"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionResponses = exports.questionOptions = exports.questions = exports.quizzes = exports.userScores = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// User scores table
exports.userScores = (0, pg_core_1.pgTable)('user_scores', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    session_id: (0, pg_core_1.varchar)('session_id', { length: 100 }).notNull(),
    age_group: (0, pg_core_1.varchar)('age_group', { length: 10 })
        .notNull()
        .$type()
        .default('18-24'),
    gender: (0, pg_core_1.varchar)('gender', { length: 20 })
        .notNull()
        .$type()
        .default('prefer_not_to_say'),
    score: (0, pg_core_1.decimal)('score', { precision: 5, scale: 2 })
        .notNull()
        .default((0, drizzle_orm_1.sql) `0`)
        .$type(),
    quiz_id: (0, pg_core_1.uuid)('quiz_id'),
    time_spent_seconds: (0, pg_core_1.integer)('time_spent_seconds')
        .notNull()
        .default(0),
    completed_at: (0, pg_core_1.timestamp)('completed_at', { withTimezone: true }).defaultNow().notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull()
});
// Quizzes table
exports.quizzes = (0, pg_core_1.pgTable)('quizzes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    passing_score: (0, pg_core_1.decimal)('passing_score', { precision: 5, scale: 2 }).default((0, drizzle_orm_1.sql) `70.00`),
    time_limit_minutes: (0, pg_core_1.integer)('time_limit_minutes'),
    is_active: (0, pg_core_1.boolean)('is_active').default(true),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull()
});
// Questions table
exports.questions = (0, pg_core_1.pgTable)('questions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    quiz_id: (0, pg_core_1.uuid)('quiz_id').notNull()
        .references(() => exports.quizzes.id, { onDelete: 'cascade' }),
    question_text: (0, pg_core_1.text)('question_text').notNull(),
    question_type: (0, pg_core_1.varchar)('question_type', { length: 20 })
        .notNull()
        .$type()
        .default('multiple_choice'),
    points: (0, pg_core_1.integer)('points').notNull().default(1),
    order_index: (0, pg_core_1.integer)('order_index').notNull(),
    correct_answer: (0, pg_core_1.text)('correct_answer'),
    explanation: (0, pg_core_1.text)('explanation'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    quizOrderPk: (0, pg_core_1.primaryKey)({
        columns: [table.quiz_id, table.order_index],
        name: 'quiz_order_pk'
    })
}));
// Question options table
exports.questionOptions = (0, pg_core_1.pgTable)('question_options', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    question_id: (0, pg_core_1.uuid)('question_id').notNull()
        .references(() => exports.questions.id, { onDelete: 'cascade' }),
    option_text: (0, pg_core_1.text)('option_text').notNull(),
    is_correct: (0, pg_core_1.boolean)('is_correct').notNull().default(false),
    order_index: (0, pg_core_1.integer)('order_index').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    questionOrderPk: (0, pg_core_1.primaryKey)({
        columns: [table.question_id, table.order_index],
        name: 'question_order_pk'
    })
}));
// Question responses table
exports.questionResponses = (0, pg_core_1.pgTable)('question_responses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    session_id: (0, pg_core_1.varchar)('session_id', { length: 100 }).notNull(),
    question_id: (0, pg_core_1.uuid)('question_id').notNull()
        .references(() => exports.questions.id, { onDelete: 'cascade' }),
    option_id: (0, pg_core_1.uuid)('option_id')
        .references(() => exports.questionOptions.id, { onDelete: 'set null' }),
    response_text: (0, pg_core_1.text)('response_text'),
    is_correct: (0, pg_core_1.boolean)('is_correct'),
    points_earned: (0, pg_core_1.decimal)('points_earned', { precision: 5, scale: 2 })
        .notNull()
        .default((0, drizzle_orm_1.sql) `0`),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull()
});
//# sourceMappingURL=schema.js.map