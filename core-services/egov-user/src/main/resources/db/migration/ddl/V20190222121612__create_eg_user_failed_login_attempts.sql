ALTER TABLE eg_user ADD COLUMN accountlockeddate bigint;
CREATE TABLE IF NOT EXISTS eg_user_login_failed_attempts (
    user_uuid character varying(64) NOT NULL,
    ip character varying(46),
    attempt_date bigint NOT NULL,
	active boolean
);
CREATE INDEX IF NOT EXISTS idx_eg_user_failed_attempts_user_uuid ON eg_user_login_failed_attempts (user_uuid);
CREATE INDEX IF NOT EXISTS idx_eg_user_failed_attempts_user_attemptdate ON eg_user_login_failed_attempts (attempt_date);