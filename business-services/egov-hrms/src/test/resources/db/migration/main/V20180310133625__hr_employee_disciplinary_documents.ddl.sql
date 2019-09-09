CREATE TABLE egeis_disciplinaryDocuments (
	id BIGINT NOT NULL,
	disciplinaryId BIGINT NOT NULL,
	documentType CHARACTER VARYING(25) ,
	filestoreId CHARACTER VARYING NOT NULL, 
	tenantId CHARACTER VARYING (250) NOT NULL,
	CONSTRAINT pk_egeis_disciplinaryDocuments PRIMARY KEY (id,tenantid)
);

CREATE SEQUENCE seq_egeis_disciplinaryDocument
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;