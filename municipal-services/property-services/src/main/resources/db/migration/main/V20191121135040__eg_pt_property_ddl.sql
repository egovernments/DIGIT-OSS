DROP TABLE IF EXISTS eg_pt_document;
DROP TABLE IF EXISTS eg_pt_address;
DROP TABLE IF EXISTS eg_pt_owner;
DROP TABLE IF EXISTS eg_pt_institution;
DROP TABLE IF EXISTS eg_pt_property;
DROP TABLE IF EXISTS eg_pt_property_audit;
DROP TABLE IF EXISTS eg_pt_address_audit;
--> Property table

CREATE TABLE eg_pt_property (

   id                   CHARACTER VARYING (128) NOT NULL,
   propertyId           CHARACTER VARYING (128),
   tenantId             CHARACTER VARYING (256) NOT NULL,
   accountId            CHARACTER VARYING (128) NOT NULL,
   oldPropertyId        CHARACTER VARYING (128),
   status               CHARACTER VARYING (128) NOT NULL,
   acknowldgementNumber CHARACTER VARYING (128),
   propertyType         CHARACTER VARYING (256) NOT NULL,
   ownershipCategory    CHARACTER VARYING (256) NOT NULL,
   usagecategory    	CHARACTER VARYING (256),
   creationReason       CHARACTER VARYING (256),
   occupancyDate        BIGINT,
   constructionDate     BIGINT,
   noOfFloors           BIGINT, 
   landArea             NUMERIC(10, 2) NOT NULL,
   source               CHARACTER VARYING (128) NOT NULL,
   createdBy            CHARACTER VARYING (128) NOT NULL,
   parentproperties     CHARACTER VARYING [],
   lastModifiedBy       CHARACTER VARYING (128),
   createdTime          BIGINT NOT NULL,
   lastModifiedTime     BIGINT,
   additionaldetails    JSONB,

CONSTRAINT pk_eg_pt_property_id PRIMARY KEY(id),
CONSTRAINT uk_eg_pt_property_propertyId UNIQUE (propertyId, tenantid)
);

CREATE INDEX IF NOT EXISTS index_eg_pt_property_parentproperties ON eg_pt_property (parentproperties);
CREATE INDEX IF NOT EXISTS index_eg_pt_property_accountId        ON eg_pt_property (accountId);
CREATE INDEX IF NOT EXISTS index_eg_pt_property_tenantid         ON eg_pt_property (tenantid);

--> Institution

CREATE TABLE eg_pt_institution (

  id               CHARACTER VARYING (128) NOT NULL,
  propertyid       CHARACTER VARYING (128) NOT NULL,
  tenantId         CHARACTER VARYING (256) NOT NULL,
  name             CHARACTER VARYING (1024) NOT NULL,
  type             CHARACTER VARYING (128) NOT NULL,
  designation      CHARACTER VARYING (128),
  createdby        CHARACTER VARYING (128) NOT NULL,
  createdtime      bigint NOT NULL,
  lastmodifiedby   CHARACTER VARYING (128),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_institution PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_institution FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
);

CREATE INDEX IF NOT EXISTS index_eg_pt_institution_tenantid ON eg_pt_property (tenantid);

--> Owner 

CREATE TABLE eg_pt_owner (

  tenantId            CHARACTER VARYING (256) NOT NULL,
  propertyid          CHARACTER VARYING (128) NOT NULL,
  userid              CHARACTER VARYING (128) NOT NULL,
  status              CHARACTER VARYING (128) NOT NULL,
  isprimaryowner      BOOLEAN  NOT NULL,
  ownertype           CHARACTER VARYING (256) NOT NULL,
  ownershippercentage CHARACTER VARYING (128),
  institutionId       CHARACTER VARYING (128),
  relationship        CHARACTER VARYING (128),
  createdby           CHARACTER VARYING (128) NOT NULL,
  createdtime         BIGINT NOT NULL,
  lastmodifiedby      CHARACTER VARYING (128),
  lastmodifiedtime    BIGINT,

  CONSTRAINT pk_eg_pt_owner PRIMARY KEY (userid, propertyid),
  CONSTRAINT fk_eg_pt_owner FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
  );

  CREATE INDEX IF NOT EXISTS index_eg_pt_owner_tenantid   ON eg_pt_owner (tenantid);

  --> document table

CREATE TABLE eg_pt_document (

  id               CHARACTER VARYING (128) NOT NULL,
  tenantId         CHARACTER VARYING (256) NOT NULL,
  entityid         CHARACTER VARYING (128) NOT NULL,
  documentType     CHARACTER VARYING (128) NOT NULL,
  fileStore        CHARACTER VARYING (128) NOT NULL,
  documentuid      CHARACTER VARYING (128) NOT NULL,
  status           CHARACTER VARYING (128) NOT NULL,
  createdBy        CHARACTER VARYING (128) NOT NULL,
  lastModifiedBy   CHARACTER VARYING (128),
  createdTime      BIGINT NOT NULL,
  lastModifiedTime BIGINT, 

CONSTRAINT pk_eg_pt_document_id PRIMARY KEY(id)
);

CREATE INDEX IF NOT EXISTS index_eg_pt_document_entityid ON eg_pt_document (entityid);
CREATE INDEX IF NOT EXISTS index_eg_pt_document_tenantid ON eg_pt_document (tenantid);

--> address

CREATE TABLE eg_pt_address (

  tenantId         CHARACTER VARYING(256) NOT NULL,
  id               CHARACTER VARYING(128) NOT NULL,
  propertyid       CHARACTER VARYING(128) NOT NULL,
  latitude         NUMERIC(9,6),
  longitude        NUMERIC(10,7),
  addressnumber    CHARACTER VARYING(128),
  doorNo           CHARACTER VARYING(64),
  type             CHARACTER VARYING(128) NOT NULL,
  addressline1     CHARACTER VARYING(1024),
  addressline2     CHARACTER VARYING(1024),
  landmark         CHARACTER VARYING(1024),
  city             CHARACTER VARYING(1024) NOT NULL,
  pincode          CHARACTER VARYING(16) NOT NULL,
  detail           CHARACTER VARYING(2048),
  buildingName     CHARACTER VARYING(1024),
  street           CHARACTER VARYING(1024),
  locality         CHARACTER VARYING(128) NOT NULL,
  createdby        CHARACTER VARYING(128) NOT NULL,
  createdtime      BIGINT NOT NULL,
  lastmodifiedby   CHARACTER VARYING(128),
  lastmodifiedtime BIGINT,

  CONSTRAINT pk_eg_pt_address PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_address FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
);

CREATE INDEX IF NOT EXISTS index_eg_pt_address_tenantid   ON eg_pt_address (tenantid);


--> Audit tables 

CREATE TABLE eg_pt_property_audit (

   id                   CHARACTER VARYING (128) NOT NULL,
   propertyId           CHARACTER VARYING (128),
   tenantId             CHARACTER VARYING (256) NOT NULL,
   accountId            CHARACTER VARYING (128) NOT NULL,
   oldPropertyId        CHARACTER VARYING (128),
   status               CHARACTER VARYING (128) NOT NULL,
   acknowldgementNumber CHARACTER VARYING (128),
   propertyType         CHARACTER VARYING (256) NOT NULL,
   ownershipCategory    CHARACTER VARYING (256) NOT NULL,
   usagecategory    	CHARACTER VARYING (256),
   creationReason       CHARACTER VARYING (256),
   occupancyDate        BIGINT,
   constructionDate     BIGINT,
   noOfFloors           BIGINT, 
   landArea             NUMERIC(10, 2) NOT NULL,
   source               CHARACTER VARYING (128) NOT NULL,
   createdBy            CHARACTER VARYING (128) NOT NULL,
   parentproperties     CHARACTER VARYING [],
   lastModifiedBy       CHARACTER VARYING (128),
   createdTime          BIGINT NOT NULL,
   lastModifiedTime     BIGINT,
   additionaldetails    JSONB,
   auditcreatedtime	    BIGINT
   
   );
   
CREATE TABLE eg_pt_address_audit (

  tenantId         CHARACTER VARYING(256) NOT NULL,
  id               CHARACTER VARYING(128) NOT NULL,
  propertyid       CHARACTER VARYING(128) NOT NULL,
  latitude         NUMERIC(9,6),
  longitude        NUMERIC(10,7),
  addressnumber    CHARACTER VARYING(128),
  doorNo           CHARACTER VARYING(64),
  type             CHARACTER VARYING(128) NOT NULL,
  addressline1     CHARACTER VARYING(1024),
  addressline2     CHARACTER VARYING(1024),
  landmark         CHARACTER VARYING(1024),
  city             CHARACTER VARYING(1024) NOT NULL,
  pincode          CHARACTER VARYING(16) NOT NULL,
  detail           CHARACTER VARYING(2048),
  buildingName     CHARACTER VARYING(1024),
  street           CHARACTER VARYING(1024),
  locality         CHARACTER VARYING(128) NOT NULL,
  createdby        CHARACTER VARYING(128) NOT NULL,
  createdtime      BIGINT NOT NULL,
  lastmodifiedby   CHARACTER VARYING(128),
  lastmodifiedtime BIGINT,
  auditcreatedtime BIGINT
  
);

