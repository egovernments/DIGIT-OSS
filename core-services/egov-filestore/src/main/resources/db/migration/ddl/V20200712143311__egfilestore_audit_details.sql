ALTER TABLE eg_filestoremap ADD COLUMN createdby character varying(64);
ALTER TABLE eg_filestoremap ADD COLUMN lastmodifiedby character varying(64);
ALTER TABLE eg_filestoremap ADD COLUMN createdtime bigint;
ALTER TABLE eg_filestoremap ADD COLUMN lastmodifiedtime bigint;
