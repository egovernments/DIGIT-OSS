DROP TABLE IF EXISTS eg_pt_drafts_v2;
DROP TABLE IF EXISTS eg_pt_institution_v2;
DROP TABLE IF EXISTS eg_pt_unit_v2;
DROP TABLE IF EXISTS eg_pt_document_owner_v2;
DROP TABLE IF EXISTS eg_pt_document_propertydetail_v2;
DROP TABLE IF EXISTS eg_pt_owner_v2;
DROP TABLE IF EXISTS eg_pt_propertydetail_v2;
DROP TABLE IF EXISTS eg_pt_address_v2;
DROP TABLE IF EXISTS eg_pt_property_v2;
DROP TABLE IF EXISTS eg_pt_property_audit_v2;
DROP TABLE IF EXISTS eg_pt_address_audit_v2;

CREATE TABLE eg_pt_property_v2(

  PropertyId character varying(64),
  tenantId character varying(256),
  acknowldgementNumber character varying(64),
  status character varying(64),
  oldPropertyId character varying(256),
  creationReason character varying(256),
  occupancyDate bigint,
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_property_v2 PRIMARY KEY (PropertyId,tenantid),
  CONSTRAINT uk_eg_pt_property_v2 UNIQUE (PropertyId)
);

CREATE TABLE eg_pt_propertydetail_v2 (
  tenantId character varying(256),
  property character varying(64),
  source character varying(64),
  usage	character varying(64),
  noOfFloors bigint,
  disclaimeragreed boolean,
  landArea	numeric,
  buildUpArea numeric,
  additionaldetails JSONB,
  channel character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  propertyType character varying(64),
  propertySubType character varying(64),
  usageCategoryMajor character varying(64),
  assessmentNumber character varying(64),
  financialYear character varying(64),
  assessmentDate bigint,
  ownershipCategory character varying(64),
  subOwnershipCategory character varying(64),
  adhocExemption numeric(12,2),
  adhocPenalty numeric(12,2),
  adhocExemptionReason character varying(1024),
  adhocPenaltyReason character varying(1024),
  accountId character varying(64),

  CONSTRAINT pk_eg_pt_propertydetail_v2 PRIMARY KEY (assessmentNumber),
  CONSTRAINT uk_eg_pt_propertydetail_v2 UNIQUE (assessmentNumber),
  CONSTRAINT fk_eg_pt_propertydetail_v2 FOREIGN KEY (property) REFERENCES eg_pt_property_v2 (propertyId)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_pt_owner_v2(
  tenantId character varying(256),
  propertydetail character varying(64),
  userid character varying(64),
  isactive boolean,
  isprimaryowner boolean,
  ownertype character varying(64),
  ownershippercentage character varying(64),
  institutionId character varying(64),
  relationship character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  CONSTRAINT pk_eg_pt_owner_v2 PRIMARY KEY (userid, propertydetail),
  CONSTRAINT fk_eg_pt_owner_v2 FOREIGN KEY (propertydetail) REFERENCES eg_pt_propertydetail_v2 (assessmentNumber)
  ON UPDATE CASCADE
  ON DELETE CASCADE
  );

CREATE TABLE eg_pt_address_v2 (
  tenantId character varying(256),
  id character varying(64),
  property character varying(64),
  latitude numeric(9,6),
  longitude numeric(10,7),
  addressid character varying(64),
  addressnumber character varying(64),
  doorNo character varying(64),
  type character varying(64),
  addressline1 character varying(1024),
  addressline2 character varying(1024),
  landmark character varying(1024),
  city character varying(1024),
  pincode character varying(6),
  detail character varying(2048),
  buildingName character varying(1024),
  street character varying(1024),
  locality character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_address_v2 PRIMARY KEY (id,property),
  CONSTRAINT fk_eg_pt_address_v2 FOREIGN KEY (property) REFERENCES eg_pt_property_v2 (propertyId)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_pt_document_propertydetail_v2 (
  tenantId character varying(256),
  id character varying(64),
  propertydetail character varying(64),
  documenttype character varying(64),
  filestore character varying(64),
  isactive boolean,
  documentuid  character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_document_propertydetail_v2 PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_document_propertydetail_v2 FOREIGN KEY (propertydetail) REFERENCES eg_pt_propertydetail_v2 (assessmentNumber)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_pt_document_owner_v2 (
  tenantId character varying(256),
  id character varying(64),
  propertydetail character varying(64),
  userid character varying(128),
  documenttype character varying(64),
  filestore character varying(64),
  isactive boolean,
  documentuid  character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_document_owner_v2 PRIMARY KEY (id),
  CONSTRAINT uk_eg_pt_document_owner_v2 UNIQUE (userid, propertydetail),
  CONSTRAINT fk_eg_pt_document_owner_v2 FOREIGN KEY (userid, propertydetail) REFERENCES eg_pt_owner_v2 (userid, propertydetail)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_pt_unit_v2 (
  tenantId character varying(256),
  id character varying(64),
  propertydetail character varying(64),
  floorNo	character varying(64),
  unitType character varying(64),
  unitArea numeric,
  usageCategoryMajor character varying(64),
  usageCategoryMinor character varying(64),
  usageCategorySubMinor character varying(64),
  usageCategoryDetail character varying(64),
  occupancyType character varying(64),
  occupancyDate bigint,
  constructionType character varying(64),
  constructionSubType character varying(64),
  arv numeric(12,2),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_unit_v2 PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_unit_v2 FOREIGN KEY (propertydetail) REFERENCES eg_pt_propertydetail_v2 (assessmentNumber)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_pt_institution_v2 (
  tenantId character varying(256),
  id character varying(64),
  propertydetail character varying(64),
  name character varying(64),
  type character varying(64),
  designation character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_institution_v2 PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_institution_v2 FOREIGN KEY (propertydetail) REFERENCES eg_pt_propertydetail_v2 (assessmentNumber)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_pt_drafts_v2(

  id character varying(64),
  tenantId character varying(256),
  userId character varying(64),
  draft JSONB,
  isActive boolean,
  assessmentNumber character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_drafts_v2 PRIMARY KEY (id,tenantid),
  CONSTRAINT uk_eg_pt_drafts_v2 UNIQUE (id)
);


CREATE TABLE eg_pt_property_audit_v2(

  PropertyId character varying(64),
  tenantId character varying(256),
  acknowldgementNumber character varying(64),
  status character varying(64),
  oldPropertyId character varying(256),
  creationReason character varying(256),
  occupancyDate bigint,
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint
);

CREATE TABLE eg_pt_address_audit_v2 (
  tenantId character varying(256),
  id character varying(64),
  property character varying(64),
  latitude numeric(9,6),
  longitude numeric(10,7),
  addressid character varying(64),
  addressnumber character varying(64),
  doorNo character varying(64),
  type character varying(64),
  addressline1 character varying(1024),
  addressline2 character varying(1024),
  landmark character varying(1024),
  city character varying(1024),
  pincode character varying(6),
  detail character varying(2048),
  buildingName character varying(1024),
  street character varying(1024),
  locality character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint
);