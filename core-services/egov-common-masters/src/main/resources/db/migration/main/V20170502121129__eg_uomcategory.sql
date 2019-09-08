CREATE TABLE eg_uomCategory (
	id BIGINT NOT NULL,
	name CHARACTER VARYING(50) NOT NULL,
	description CHARACTER VARYING(250),
	active BOOLEAN NOT NULL,
	tenantId CHARACTER VARYING(256) NOT NULL,

	CONSTRAINT pk_eg_uomCategory PRIMARY KEY (id, tenantId),
	CONSTRAINT uk_eg_uomCategory_name_tenantId UNIQUE (name, tenantId)
);

CREATE SEQUENCE seq_eg_uomCategory
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;