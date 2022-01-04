ALTER TABLE message ADD COLUMN module varchar(255) NOT NULL DEFAULT 'default';
ALTER TABLE message ALTER COLUMN module DROP DEFAULT;
ALTER TABLE message DROP CONSTRAINT unique_message_entry;
ALTER TABLE message ADD	CONSTRAINT unique_message_entry unique (tenantid, locale, module, code);
