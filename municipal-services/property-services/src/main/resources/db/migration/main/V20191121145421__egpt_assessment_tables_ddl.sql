DROP TABLE IF EXISTS  eg_pt_unit;
DROP TABLE IF EXISTS eg_pt_assessments;
DROP TABLE IF EXISTS  eg_pt_unit_audits;
DROP TABLE IF EXISTS eg_pt_assessments_audits;


CREATE TABLE eg_pt_assessments (

  id character varying(256) NOT NULL,
  financialyear character varying(256) NOT NULL,
  tenantId character varying(256) NOT NULL,
  assessmentNumber character varying(64) NOT NULL,
  status character varying(64) NOT NULL,
  propertyId character varying(256) NOT NULL,
  source character varying(64) NOT NULL,
  assessmentDate bigint NOT NULL,
  buildUpArea numeric,
  additionalDetails jsonb,
  createdby character varying(64) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(64) NOT NULL,
  lastmodifiedtime bigint NOT NULL,

  CONSTRAINT pk_eg_pt_assessments PRIMARY KEY (id),
  CONSTRAINT uk_eg_pt_assessments UNIQUE (assessmentNumber, tenantId),
  CONSTRAINT fk_eg_pt_assessments FOREIGN KEY (propertyId) REFERENCES eg_pt_property (id)
  
  ON UPDATE CASCADE
  ON DELETE CASCADE
);



CREATE TABLE eg_pt_unit (

  tenantId character varying(256) NOT NULL,
  id character varying(256) NOT NULL,
  assessmentId character varying(256) NOT NULL,
  floorNo	character varying(64),
  unitArea numeric NOT NULL,
  usageCategory character varying(256) NOT NULL,
  occupancyType character varying(64) NOT NULL,
  occupancyDate bigint,
  constructionType character varying(64) NOT NULL,
  arv numeric(12,2),
  active BOOLEAN,
  createdby character varying(64) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(64) NOT NULL,
  lastmodifiedtime bigint NOT NULL,

  CONSTRAINT pk_eg_pt_unit PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_unit FOREIGN KEY (assessmentId) REFERENCES eg_pt_assessments (id)
  
  ON UPDATE CASCADE
  ON DELETE CASCADE
);


CREATE TABLE eg_pt_assessments_audit (

  id character varying(256) NOT NULL,
  financialyear character varying(256) NOT NULL,
  tenantId character varying(256) NOT NULL,
  assessmentNumber character varying(64) NOT NULL,
  status character varying(64) NOT NULL,
  propertyId character varying(256) NOT NULL,
  source character varying(64) NOT NULL,
  assessmentDate bigint NOT NULL,
  buildUpArea numeric,
  additionalDetails jsonb,
  createdby character varying(64) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(64) NOT NULL,
  lastmodifiedtime bigint NOT NULL
  
);



CREATE TABLE eg_pt_unit_audit (

  tenantId character varying(256) NOT NULL,
  id character varying(256) NOT NULL,
  assessmentId character varying(256) NOT NULL,
  floorNo	character varying(64),
  unitArea numeric NOT NULL,
  usageCategory character varying(256) NOT NULL,
  occupancyType character varying(64) NOT NULL,
  occupancyDate bigint,
  constructionType character varying(64) NOT NULL,
  arv numeric(12,2),
  active BOOLEAN,
  createdby character varying(64) NOT NULL,
  createdtime bigint NOT NULL,
  lastmodifiedby character varying(64) NOT NULL,
  lastmodifiedtime bigint NOT NULL
  
);