CREATE TABLE egeis_nominee (
	id BIGINT NOT NULL,
	employeeId BIGINT NOT NULL,
	name CHARACTER VARYING(100) NOT NULL,
	gender CHARACTER VARYING(15) NOT NULL,
	dateOfBirth BIGINT NOT NULL,
	maritalStatus CHARACTER VARYING(15) NOT NULL,
	relationship CHARACTER VARYING(20) NOT NULL,
	bankId BIGINT,
	bankBranchId BIGINT,
	bankAccount CHARACTER VARYING(20),
	nominated boolean NOT NULL,
	employed boolean NOT NULL,
	createdBy BIGINT NOT NULL,
	createdDate BIGINT NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate BIGINT,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_nominee PRIMARY KEY (id, tenantId),
	CONSTRAINT fk_egeis_nominee_employeeId FOREIGN KEY (employeeId, tenantId)
	    REFERENCES egeis_employee (id, tenantId)
);

CREATE SEQUENCE seq_egeis_nominee
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;