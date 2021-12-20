CREATE TABLE eg_hrms_employee (
	id BIGINT NOT NULL,
	uuid CHARACTER VARYING(1024) NOT NULL,
	code CHARACTER VARYING(250),
	phone CHARACTER VARYING(250),
	name CHARACTER VARYING(250),
    dateOfAppointment BIGINT,
    employeestatus CHARACTER VARYING(250),
    employeetype CHARACTER VARYING(250),
    active BOOLEAN,
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_employee PRIMARY KEY (uuid),
	CONSTRAINT uk_eghrms_employee_code UNIQUE (code)
);



CREATE TABLE eg_hrms_assignment (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	position BIGINT,
	department CHARACTER VARYING(250),
	designation CHARACTER VARYING(250),
    fromdate BIGINT,
    todate BIGINT,
	govtordernumber CHARACTER VARYING(250),
	reportingto CHARACTER VARYING(250),
	isHOD BOOLEAN,
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_assignment PRIMARY KEY (uuid),
    CONSTRAINT ck_eghrms_employee_fromTo CHECK (fromdate <= todate),
	CONSTRAINT fk_eghrms_assignment_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);


CREATE TABLE eg_hrms_educationaldetails (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	qualification CHARACTER VARYING(250),
	stream CHARACTER VARYING(250),
    yearofpassing BIGINT,
    university CHARACTER VARYING(250),
	remarks CHARACTER VARYING(250),
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_educationaldetails PRIMARY KEY (uuid),
	CONSTRAINT fk_eghrms_educationaldetails_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);


CREATE TABLE eg_hrms_departmentaltests (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	test CHARACTER VARYING(250),
    yearofpassing BIGINT,
	remarks CHARACTER VARYING(250),
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_departmentaltests PRIMARY KEY (uuid),
	CONSTRAINT fk_eghrms_departmentaltests_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);


CREATE TABLE eg_hrms_empdocuments (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	documentid CHARACTER VARYING(250) NOT NULL,
    documentname CHARACTER VARYING(250),
	referencetype CHARACTER VARYING(250),
	referenceid CHARACTER VARYING(250) NOT NULL,
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_empdocuments PRIMARY KEY (uuid),
	CONSTRAINT fk_eghrms_empdocuments_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);


CREATE TABLE eg_hrms_servicehistory (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	servicestatus CHARACTER VARYING(250),
	servicefrom BIGINT,
	serviceto BIGINT,
	ordernumber CHARACTER VARYING(250),
	isCurrentPosition BOOLEAN,
	location CHARACTER VARYING(250),
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_servicehistory  PRIMARY KEY (uuid),
	CONSTRAINT fk_eghrms_servicehistory_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);

CREATE TABLE eg_hrms_jurisdiction (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	hierarchy CHARACTER VARYING(250) NOT NULL,
	boundarytype CHARACTER VARYING(250) NOT NULL,
	boundary CHARACTER VARYING(250) NOT NULL,
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_jurisdiction  PRIMARY KEY (uuid),
	CONSTRAINT fk_eghrms_jurisdiction_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);

CREATE TABLE eg_hrms_deactivationdetails (
	uuid CHARACTER VARYING(1024) NOT NULL,
	employeeid CHARACTER VARYING(1024) NOT NULL,
	reasonfordeactivation CHARACTER VARYING(250),
	effectivefrom BIGINT,
	ordernumber CHARACTER VARYING(250),
	typeOfDeactivation CHARACTER VARYING(250),
	tenantid CHARACTER VARYING(250) NOT NULL,
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	
	CONSTRAINT pk_eghrms_deactivationdetails  PRIMARY KEY (uuid),
	CONSTRAINT fk_eghrms_deactivationdetails_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

);


