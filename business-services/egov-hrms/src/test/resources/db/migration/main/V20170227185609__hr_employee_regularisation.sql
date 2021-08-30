CREATE TABLE egeis_regularisation (
	id BIGINT NOT NULL,
	employeeId BIGINT NOT NULL,
    designationId BIGINT NOT NULL,
	declaredOn DATE NOT NULL,
	orderNo CHARACTER VARYING(250),
	orderDate DATE NOT NULL,
	remarks CHARACTER VARYING(250),
	createdBy BIGINT NOT NULL,
	createdDate DATE NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate DATE,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_regularisation PRIMARY KEY (Id),
	CONSTRAINT fk_egeis_regularisation_employeeId FOREIGN KEY (employeeId)
		REFERENCES egeis_employee (id)
);

CREATE SEQUENCE seq_egeis_regularisation
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;