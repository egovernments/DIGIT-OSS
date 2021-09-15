CREATE INDEX IF NOT EXISTS index_eg_ss_question_surveyId ON eg_ss_question (surveyid);
CREATE INDEX IF NOT EXISTS index_eg_ss_answer_surveyId_citizenId ON eg_ss_answer (surveyid,citizenid);
