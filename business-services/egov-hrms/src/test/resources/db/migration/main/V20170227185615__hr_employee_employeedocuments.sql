CREATE TABLE egeis_employeeDocuments (
	id BIGINT NOT NULL,
	employeeId BIGINT NOT NULL,
	document CHARACTER VARYING(1000) NOT NULL,
	referenceType CHARACTER VARYING(25),
	referenceId BIGINT,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_employeeDocuments PRIMARY KEY (Id),
	CONSTRAINT uk_egeis_employeeDocuments_document UNIQUE (document)
);

CREATE SEQUENCE seq_egeis_employeeDocuments
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;