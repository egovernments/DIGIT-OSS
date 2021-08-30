CREATE TABLE egeis_employeeLanguages (
	id BIGINT NOT NULL,
    employeeId BIGINT NOT NULL,
	languageId BIGINT NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_employee_languages PRIMARY KEY (Id)
);

CREATE SEQUENCE seq_egeis_employeeLanguages
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;