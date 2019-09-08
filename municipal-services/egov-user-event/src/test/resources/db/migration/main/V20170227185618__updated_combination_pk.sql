---------------------------- DROP FOREIGN KEYS ----------------------------

ALTER TABLE egeis_assignment DROP CONSTRAINT fk_egeis_assignment_employeeid;
ALTER TABLE egeis_hoddepartment DROP CONSTRAINT fk_egeis_hoddepartment_assignmentid;
ALTER TABLE egeis_employeejurisdictions DROP CONSTRAINT fk_egeis_employeejurisdictions_employeeid;
ALTER TABLE egeis_employeelanguages DROP CONSTRAINT fk_egeis_employeelanguages_employeeid;
ALTER TABLE egeis_departmentaltest DROP CONSTRAINT fk_egeis_departmentaltest_employeeid;
ALTER TABLE egeis_educationalqualification DROP CONSTRAINT fk_egeis_educationalqualification_employeeid;
ALTER TABLE egeis_probation DROP CONSTRAINT fk_egeis_probation_employeeid;
ALTER TABLE egeis_regularisation DROP CONSTRAINT fk_egeis_regularisation_employeeid;
ALTER TABLE egeis_servicehistory DROP CONSTRAINT fk_egeis_servicehistory_employeeid;
ALTER TABLE egeis_technicalqualification DROP CONSTRAINT fk_egeis_technicalqualification_employeeid;


--------------------------- UPDATE PRIMARY KEYS ---------------------------

-- EGEIS_EMPLOYEE TABLE
ALTER TABLE egeis_employee DROP CONSTRAINT uk_egeis_employee_bankaccount;
ALTER TABLE egeis_employee DROP CONSTRAINT pk_egeis_employee;
ALTER TABLE egeis_employee ADD CONSTRAINT pk_egeis_employee PRIMARY KEY (id, tenantId);

-- EGEIS_ASSIGNMENT TABLE
ALTER TABLE egeis_assignment DROP CONSTRAINT pk_egeis_assignment;
ALTER TABLE egeis_assignment ADD CONSTRAINT pk_egeis_assignment PRIMARY KEY (id, tenantId);

-- EGEIS_HODDEPARTMENT TABLE
ALTER TABLE egeis_hoddepartment DROP CONSTRAINT pk_egeis_hoddepartment;
ALTER TABLE egeis_hoddepartment ADD CONSTRAINT pk_egeis_hoddepartment PRIMARY KEY (id, tenantId);

-- EGEIS_EMPLOYEEDOCUMENTS TABLE
ALTER TABLE egeis_employeedocuments DROP CONSTRAINT pk_egeis_employeedocuments;
ALTER TABLE egeis_employeedocuments ADD CONSTRAINT pk_egeis_employeedocuments PRIMARY KEY (id, tenantId);

-- EGEIS_EMPLOYEEJURISDICTIONS TABLE
ALTER TABLE egeis_employeejurisdictions DROP CONSTRAINT pk_egeis_employeejurisdictions;
ALTER TABLE egeis_employeejurisdictions ADD CONSTRAINT pk_egeis_employeejurisdictions PRIMARY KEY (id, tenantId);

-- EGEIS_EMPLOYEELANGUAGES TABLE
ALTER TABLE egeis_employeelanguages DROP CONSTRAINT pk_egeis_employee_languages;
ALTER TABLE egeis_employeelanguages ADD CONSTRAINT pk_egeis_employeelanguages PRIMARY KEY (id, tenantId);

-- EGEIS_DEPARTMENTALTEST TABLE
ALTER TABLE egeis_departmentaltest DROP CONSTRAINT pk_egeis_departmentaltest;
ALTER TABLE egeis_departmentaltest ADD CONSTRAINT pk_egeis_departmentaltest PRIMARY KEY (id, tenantId);

-- EGEIS_EDUCATIONALQUALIFICATION TABLE
ALTER TABLE egeis_educationalqualification DROP CONSTRAINT pk_egeis_educationalqualification;
ALTER TABLE egeis_educationalqualification ADD CONSTRAINT pk_egeis_educationalqualification PRIMARY KEY (id, tenantId);

-- EGEIS_PROBATION TABLE
ALTER TABLE egeis_probation DROP CONSTRAINT pk_egeis_probation;
ALTER TABLE egeis_probation ADD CONSTRAINT pk_egeis_probation PRIMARY KEY (id, tenantId);

-- EGEIS_REGULARISATION TABLE
ALTER TABLE egeis_regularisation DROP CONSTRAINT pk_egeis_regularisation;
ALTER TABLE egeis_regularisation ADD CONSTRAINT pk_egeis_regularisation PRIMARY KEY (id, tenantId);

-- EGEIS_SERVICEHISTORY TABLE
ALTER TABLE egeis_servicehistory DROP CONSTRAINT pk_egeis_servicehistory;
ALTER TABLE egeis_servicehistory ADD CONSTRAINT pk_egeis_servicehistory PRIMARY KEY (id, tenantId);

-- EGEIS_TECHNICALQUALIFICATION TABLE
ALTER TABLE egeis_technicalqualification DROP CONSTRAINT pk_egeis_technicalqualification;
ALTER TABLE egeis_technicalqualification ADD CONSTRAINT pk_egeis_technicalqualification PRIMARY KEY (id, tenantId);


-------------------------- RECREATE FOREIGN KEYS --------------------------

ALTER TABLE egeis_assignment ADD CONSTRAINT fk_egeis_assignment_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_hoddepartment ADD CONSTRAINT fk_egeis_hoddepartment_assignmentid FOREIGN KEY (assignmentid, tenantId)
	REFERENCES egeis_assignment (id, tenantId);
ALTER TABLE egeis_employeejurisdictions ADD CONSTRAINT fk_egeis_employeejurisdictions_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_employeelanguages ADD CONSTRAINT fk_egeis_employeelanguages_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_departmentaltest ADD CONSTRAINT fk_egeis_departmentaltest_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_educationalqualification ADD CONSTRAINT fk_egeis_educationalqualification_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_probation ADD CONSTRAINT fk_egeis_probation_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_regularisation ADD CONSTRAINT fk_egeis_regularisation_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_servicehistory ADD CONSTRAINT fk_egeis_servicehistory_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);
ALTER TABLE egeis_technicalqualification ADD CONSTRAINT fk_egeis_technicalqualification_employeeid FOREIGN KEY (employeeid, tenantId)
	REFERENCES egeis_employee (id, tenantId);

