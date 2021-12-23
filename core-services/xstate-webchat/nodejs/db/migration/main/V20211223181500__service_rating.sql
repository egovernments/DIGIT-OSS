CREATE TABLE eg_webchat_service_rating (
    id character varying(64),
    user_id character varying(64),
    starrating int,
    feedbackoptions jsonb,
    comments TEXT,
    filestoreid character varying(256),
    createdTime bigint
);
CREATE INDEX IF NOT EXISTS eg_webchat_service_rating_idx_user_id_v2 ON eg_webchat_service_rating (user_id);


