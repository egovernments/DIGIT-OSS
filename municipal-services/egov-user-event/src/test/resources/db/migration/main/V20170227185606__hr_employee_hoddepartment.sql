CREATE TABLE egeis_hodDepartment (
	id BIGINT NOT NULL,
	departmentId BIGINT NOT NULL,
	assignmentId BIGINT NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_hodDepartment PRIMARY KEY (Id),
    CONSTRAINT egeis_hodDepartment_assignmentId FOREIGN KEY (assignmentId)
        REFERENCES egeis_assignment(id)
);

CREATE SEQUENCE seq_egeis_hodDepartment
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;