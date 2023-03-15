CREATE TABLE egeis_employee (
    id BIGINT NOT NULL,
	code CHARACTER VARYING(250),
	dateOfAppointment DATE,
	dateOfJoining DATE,
	dateOfRetirement DATE,
    employeeStatus CHARACTER VARYING(250),
    recruitmentModeId BIGINT,
    recruitmentTypeId BIGINT,
    recruitmentQuotaId BIGINT,
    retirementAge INTEGER,
    dateOfResignation DATE,
    dateOfTermination DATE,
    employeeTypeId BIGINT,
    motherTongueId BIGINT,
    religionId BIGINT,
    communityId BIGINT,
    categoryId BIGINT,
	physicallyDisabled BOOLEAN NOT NULL,
	medicalReportProduced BOOLEAN NOT NULL,
    maritalStatus CHARACTER VARYING(250),
	passportNo CHARACTER VARYING(250) NOT NULL,
	gpfNo CHARACTER VARYING(250) NOT NULL,
	bankId BIGINT,
	bankBranchId BIGINT,
	bankAccount CHARACTER VARYING(20) NOT NULL,
    groupId BIGINT,
	placeOfBirth CHARACTER VARYING(200) NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_employee PRIMARY KEY (Id),
	CONSTRAINT uk_egeis_employee_code UNIQUE (code),
    CONSTRAINT ck_egeis_employee_retirementAge CHECK (retirementAge <= 100),
    CONSTRAINT ck_egeis_employee_dateOfAppointment CHECK (dateOfAppointment <= dateOfJoining),
    CONSTRAINT ck_egeis_employee_dateOfRetirement CHECK (dateOfRetirement >= dateOfJoining),
    CONSTRAINT ck_egeis_employee_dateOfResignation CHECK (dateOfResignation >= dateOfJoining),
    CONSTRAINT ck_egeis_employee_dateOfTermination CHECK (dateOfTermination >= dateOfJoining)
);

CREATE SEQUENCE seq_egeis_employee
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;