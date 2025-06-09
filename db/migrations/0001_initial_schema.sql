-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE age_group_enum AS ENUM ('18-24', '25-34', '35-44', '45-54', '55-64', '65-70', '71+');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE question_type_enum AS ENUM ('multiple_choice', 'true_false', 'short_answer');

-- Create tables
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    time_limit_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type_enum NOT NULL DEFAULT 'multiple_choice',
    points INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL,
    correct_answer TEXT,
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_quiz FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT unique_quiz_question_order UNIQUE(quiz_id, order_index)
);

CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_question FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT unique_question_option_order UNIQUE(question_id, order_index)
);

CREATE TABLE IF NOT EXISTS user_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_id VARCHAR(20) GENERATED ALWAYS AS ('User_' || id::TEXT) STORED,
    age_group age_group_enum NOT NULL,
    gender gender_enum NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT score_range CHECK (score >= 0 AND score <= 100)
);

CREATE TABLE IF NOT EXISTS question_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
    response_text TEXT,
    is_correct BOOLEAN NOT NULL,
    points_earned DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_question_response FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_option_response FOREIGN KEY(option_id) REFERENCES question_options(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_scores_session ON user_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_session ON question_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options(question_id);

-- Add comments
COMMENT ON TABLE quizzes IS 'Stores information about quizzes';
COMMENT ON TABLE questions IS 'Stores questions for each quiz';
COMMENT ON TABLE question_options IS 'Stores answer options for multiple choice questions';
COMMENT ON TABLE user_scores IS 'Stores user quiz scores with demographic information';
COMMENT ON TABLE question_responses IS 'Stores individual question responses from users';
