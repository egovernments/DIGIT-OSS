CREATE TABLE egeis_aprDetails (
	id BIGINT NOT NULL,
	employeeId BIGINT NOT NULL,
	yearOfSubmission INTEGER NOT NULL,
	detailsSubmitted BOOLEAN NOT NULL,
	dateOfSubmission DATE,
	remarks CHARACTER VARYING(1024),
	createdBy BIGINT NOT NULL,
	createdDate TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	lastModifiedBy BIGINT,
	lastModifiedDate  TIMESTAMP WITHOUT TIME ZONE,
	tenantId CHARACTER VARYING(256) NOT NULL,

	CONSTRAINT pk_egeis_aprDetails PRIMARY KEY (id, tenantId),
	CONSTRAINT fk_egeis_aprDetails_employeeId FOREIGN KEY (employeeId, tenantId)
	    REFERENCES egeis_employee (id, tenantId)
);

CREATE SEQUENCE seq_egeis_aprDetails
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;