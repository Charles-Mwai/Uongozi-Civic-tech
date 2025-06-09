"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveScore = saveScore;
exports.getScoreStats = getScoreStats;
exports.getScoreDistribution = getScoreDistribution;
exports.getScoresByDate = getScoresByDate;
exports.getQuizResults = getQuizResults;
exports.saveQuestionResponse = saveQuestionResponse;
exports.getUserQuizResults = getUserQuizResults;
const drizzle_orm_1 = require("drizzle-orm");
const index_js_1 = require("./index.js");
const schema_js_1 = require("./schema.js");
const drizzle_orm_2 = require("drizzle-orm");
async function saveScore(scoreData) {
    return index_js_1.db.insert(schema_js_1.userScores).values({
        age_group: scoreData.ageGroup,
        gender: scoreData.gender,
        score: scoreData.score.toString(),
        session_id: scoreData.sessionId,
        quiz_id: scoreData.quizId,
        time_spent_seconds: scoreData.timeSpentSeconds,
    }).returning();
}
async function getScoreStats() {
    return index_js_1.db.select({
        ageGroup: schema_js_1.userScores.age_group,
        gender: schema_js_1.userScores.gender,
        count: (0, drizzle_orm_1.sql) `count(*)`,
        average: (0, drizzle_orm_1.sql) `avg(${schema_js_1.userScores.score}::numeric)`,
        min: (0, drizzle_orm_1.sql) `min(${schema_js_1.userScores.score}::numeric)`,
        max: (0, drizzle_orm_1.sql) `max(${schema_js_1.userScores.score}::numeric)`,
    })
        .from(schema_js_1.userScores)
        .groupBy(schema_js_1.userScores.age_group, schema_js_1.userScores.gender);
}
async function getScoreDistribution() {
    return index_js_1.db.select({
        score: (0, drizzle_orm_1.sql) `ROUND(${schema_js_1.userScores.score}::numeric, 0)::int`,
        count: (0, drizzle_orm_1.sql) `count(*)`,
    })
        .from(schema_js_1.userScores)
        .groupBy((0, drizzle_orm_1.sql) `ROUND(${schema_js_1.userScores.score}::numeric, 0)::int`)
        .orderBy((0, drizzle_orm_1.sql) `ROUND(${schema_js_1.userScores.score}::numeric, 0)::int`);
}
async function getScoresByDate() {
    return index_js_1.db.select({
        date: (0, drizzle_orm_1.sql) `to_char(${schema_js_1.userScores.completed_at}, 'YYYY-MM-DD')`,
        count: (0, drizzle_orm_1.sql) `count(*)`,
        average: (0, drizzle_orm_1.sql) `avg(${schema_js_1.userScores.score}::numeric)`,
    })
        .from(schema_js_1.userScores)
        .groupBy((0, drizzle_orm_1.sql) `to_char(${schema_js_1.userScores.completed_at}, 'YYYY-MM-DD')`)
        .orderBy((0, drizzle_orm_1.sql) `to_char(${schema_js_1.userScores.completed_at}, 'YYYY-MM-DD')`);
}
async function getQuizResults(quizId) {
    // Find the quiz
    const quiz = await index_js_1.db.query.quizzes.findFirst({
        where: (0, drizzle_orm_2.eq)(schema_js_1.quizzes.id, quizId)
    });
    if (!quiz)
        return undefined;
    // Find related questions
    const quizQuestions = await index_js_1.db.query.questions.findMany({
        where: (0, drizzle_orm_2.eq)(schema_js_1.questions.quiz_id, quizId)
    });
    // Find options and responses for each question
    const questionsWithRelations = await Promise.all(quizQuestions.map(async (question) => {
        const [options, responses] = await Promise.all([
            index_js_1.db.query.questionOptions.findMany({
                where: (0, drizzle_orm_2.eq)(schema_js_1.questionOptions.question_id, question.id)
            }),
            index_js_1.db.query.questionResponses.findMany({
                where: (0, drizzle_orm_2.eq)(schema_js_1.questionResponses.question_id, question.id)
            })
        ]);
        return {
            ...question,
            options,
            responses
        };
    }));
    return {
        ...quiz,
        questions: questionsWithRelations
    };
}
async function saveQuestionResponse(params) {
    return index_js_1.db.insert(schema_js_1.questionResponses).values({
        session_id: params.sessionId,
        question_id: params.questionId,
        option_id: params.optionId,
        response_text: params.responseText,
        is_correct: params.isCorrect,
        points_earned: params.pointsEarned.toString(),
    }).returning();
}
async function getUserQuizResults(sessionId) {
    const scores = await index_js_1.db.query.userScores.findMany({
        where: (0, drizzle_orm_2.eq)(schema_js_1.userScores.session_id, sessionId),
        orderBy: [(0, drizzle_orm_2.desc)(schema_js_1.userScores.completed_at)]
    });
    // Get unique quiz IDs
    const quizIds = new Set();
    for (const score of scores) {
        if (score.quiz_id) {
            quizIds.add(score.quiz_id);
        }
    }
    // Fetch all related quizzes in one query
    const quizMap = new Map();
    if (quizIds.size > 0) {
        const quizList = Array.from(quizIds);
        const quizResults = await index_js_1.db.query.quizzes.findMany({
            where: (table, { inArray }) => inArray(table.id, quizList)
        });
        for (const quiz of quizResults) {
            if (quiz) {
                quizMap.set(quiz.id, quiz);
            }
        }
    }
    // Combine scores with their quizzes
    return scores.map((score) => ({
        ...score,
        quiz: score.quiz_id ? quizMap.get(score.quiz_id) || null : null
    }));
}
//# sourceMappingURL=queries.js.map