 ALTER TABLE eg_hrms_employee ADD COLUMN reactivateemployee BOOLEAN;

 CREATE TABLE eg_hrms_reactivationdetails (
 	uuid CHARACTER VARYING(1024) NOT NULL,
 	employeeid CHARACTER VARYING(1024) NOT NULL,
 	reasonforreactivation CHARACTER VARYING(250),
 	effectivefrom BIGINT,
 	ordernumber CHARACTER VARYING(250),
 	remarks CHARACTER VARYING(250),
 	tenantid CHARACTER VARYING(250) NOT NULL,
 	createdby CHARACTER VARYING(250) NOT NULL,
 	createddate BIGINT NOT NULL,
 	lastmodifiedby CHARACTER VARYING(250),
 	lastModifiedDate BIGINT,

 	CONSTRAINT pk_eghrms_reactivationdetails  PRIMARY KEY (uuid),
 	CONSTRAINT fk_eghrms_reactivationdetails_employeeid FOREIGN KEY (employeeid) REFERENCES eg_hrms_employee (uuid)  ON DELETE CASCADE

 );
