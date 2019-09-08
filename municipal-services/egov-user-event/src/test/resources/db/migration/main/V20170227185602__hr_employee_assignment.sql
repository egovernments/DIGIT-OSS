CREATE TABLE egeis_assignment (
	id BIGINT NOT NULL,
	employeeId BIGINT,
    positionId BIGINT NOT NULL,
	fundId BIGINT,
	functionaryId BIGINT,
	functionId BIGINT,
	departmentId BIGINT NOT NULL,
	designationId BIGINT NOT NULL,
	isPrimary BOOLEAN NOT NULL,
	fromDate DATE NOT NULL,
	toDate DATE NOT NULL,
    gradeId BIGINT,
	govtOrderNumber CHARACTER VARYING(250),
	createdBy BIGINT NOT NULL,
	createdDate DATE NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate DATE,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_assignment PRIMARY KEY (id),
	CONSTRAINT fk_egeis_assignment_employeeId FOREIGN KEY (employeeId)
		REFERENCES egeis_employee (id)
);

CREATE SEQUENCE seq_egeis_assignment
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;