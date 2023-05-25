CREATE TABLE egeis_departmentalTest (
	id BIGINT NOT NULL,
	employeeId BIGINT NOT NULL,
	test CHARACTER VARYING(250) NOT NULL,
	yearOfPassing INTEGER NOT NULL,
	remarks CHARACTER VARYING(250),
	createdBy BIGINT NOT NULL,
	createdDate DATE NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate DATE,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_departmentalTest PRIMARY KEY (Id),
	CONSTRAINT fk_egeis_departmentalTest_employeeId FOREIGN KEY (employeeId)
		REFERENCES egeis_employee (id)
);

CREATE SEQUENCE seq_egeis_departmentalTest
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;