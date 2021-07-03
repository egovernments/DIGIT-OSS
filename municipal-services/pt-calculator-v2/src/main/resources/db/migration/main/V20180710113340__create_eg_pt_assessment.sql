CREATE TABLE eg_pt_assessment
(

  uuid character varying(64),
  assessmentNumber character varying(64),
  demandId character varying(64),
  propertyId character varying(64),
  assessmentYear character varying(64),
  tenantId character varying(64),
  createdBy character varying(64),
  createdTime bigint,
  lastModifiedBy character varying(64),
  lastModifiedTime bigint,
  CONSTRAINT pk_eg_pt_assessment PRIMARY KEY (uuid),
  CONSTRAINT uk_eg_pt_assessment_property_assessment UNIQUE (propertyId, assessmentNumber, demandId)
);
