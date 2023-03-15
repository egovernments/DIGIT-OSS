ALTER TABLE message ADD COLUMN createdby bigint NOT NULL DEFAULT 1;
ALTER TABLE message ALTER COLUMN createdby DROP DEFAULT;
ALTER TABLE message ADD COLUMN createddate timestamp NOT NULL DEFAULT now();
ALTER TABLE message ADD COLUMN lastmodifiedby bigint;
ALTER TABLE message ADD COLUMN lastmodifieddate timestamp;