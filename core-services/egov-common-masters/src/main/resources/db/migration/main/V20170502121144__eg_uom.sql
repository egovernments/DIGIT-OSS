CREATE TABLE eg_uom (
	id BIGINT NOT NULL,
	code CHARACTER VARYING(256) NOT NULL,
	description CHARACTER VARYING(256) NOT NULL,
	categoryId BIGINT NOT NULL,
	active BOOLEAN NOT NULL,
	coversionFactor REAL,
	baseuom BOOLEAN,
	createdBy BIGINT NOT NULL,
	createdDate TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate TIMESTAMP WITHOUT TIME ZONE,
	tenantId CHARACTER VARYING(256) NOT NULL,

	CONSTRAINT pk_eg_uom PRIMARY KEY (id, tenantId),
	CONSTRAINT uk_eg_uom_code_tenantId UNIQUE (code, tenantId),
	CONSTRAINT fk_eg_uom_categoryId_tenantId FOREIGN KEY (categoryId, tenantId)
		REFERENCES eg_uomCategory(id, tenantId)
);

CREATE SEQUENCE seq_eg_uom
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;