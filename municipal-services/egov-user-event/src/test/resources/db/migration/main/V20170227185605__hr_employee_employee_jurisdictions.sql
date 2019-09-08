CREATE TABLE egeis_employeeJurisdictions (
	id BIGINT NOT NULL,
    employeeId BIGINT NOT NULL,
	jurisdictionId BIGINT NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_employeeJurisdictions PRIMARY KEY (Id)
);

CREATE SEQUENCE seq_egeis_employeeJurisdictions
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;