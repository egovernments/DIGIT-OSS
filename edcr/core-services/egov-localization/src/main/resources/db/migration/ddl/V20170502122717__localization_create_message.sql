DROP  TABLE IF EXISTS message;
DROP  SEQUENCE IF EXISTS SEQ_MESSAGE;

CREATE TABLE message (
	id bigint not null primary key,
	locale varchar(255) not null,
	code varchar(255) not null,
	message varchar(500) not null,
	tenantid character varying(256) not null,
	constraint unique_message_entry unique (locale, code, tenantid)
);

Create sequence SEQ_MESSAGE;

CREATE INDEX message_locale_tenant ON message (locale, tenantid);
