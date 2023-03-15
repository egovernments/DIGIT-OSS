ALTER TABLE eg_ws_service
ADD COLUMN IF NOT EXISTS createdBy character varying(64),
ADD COLUMN IF NOT EXISTS lastModifiedBy character varying(64),
ADD COLUMN IF NOT EXISTS createdTime bigint,
ADD COLUMN IF NOT EXISTS lastModifiedTime bigint,
ADD COLUMN IF NOT EXISTS estimationLetterDate bigint;
;

ALTER TABLE eg_ws_plumberinfo
ADD COLUMN IF NOT EXISTS createdBy character varying(64),
ADD COLUMN IF NOT EXISTS lastModifiedBy character varying(64),
ADD COLUMN IF NOT EXISTS createdTime bigint,
ADD COLUMN IF NOT EXISTS lastModifiedTime bigint,
ADD COLUMN IF NOT EXISTS tenantid character varying(64);

