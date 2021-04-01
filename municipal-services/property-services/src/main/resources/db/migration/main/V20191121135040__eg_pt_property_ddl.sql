DROP TABLE IF EXISTS eg_pt_document;
DROP TABLE IF EXISTS eg_pt_address;
DROP TABLE IF EXISTS eg_pt_owner;
DROP TABLE IF EXISTS eg_pt_institution;
DROP TABLE IF EXISTS eg_pt_unit;
DROP TABLE IF EXISTS eg_pt_property;
DROP TABLE IF EXISTS eg_pt_property_audit;

--> Property table

CREATE TABLE eg_pt_property (

   id                   CHARACTER VARYING (128) NOT NULL,
   propertyid           CHARACTER VARYING (256),
   tenantid             CHARACTER VARYING (256) NOT NULL,
   surveyid             CHARACTER VARYING (256),
   accountid            CHARACTER VARYING (128) NOT NULL,
   oldpropertyid        CHARACTER VARYING (128),
   status               CHARACTER VARYING (128) NOT NULL,
   acknowldgementnumber CHARACTER VARYING (128),
   propertytype         CHARACTER VARYING (256) NOT NULL,
   ownershipcategory    CHARACTER VARYING (256) NOT NULL,
   usagecategory    	CHARACTER VARYING (256),
   creationreason       CHARACTER VARYING (256),
   nooffloors           BIGINT, 
   landarea             NUMERIC(10, 2),
   superbuiltuparea     NUMERIC(10, 2),
   linkedproperties     CHARACTER VARYING (2048),
   source               CHARACTER VARYING (128) NOT NULL,
   channel              CHARACTER VARYING (128) NOT NULL,
   createdby            CHARACTER VARYING (128) NOT NULL,
   lastModifiedBy       CHARACTER VARYING (128),
   createdTime          BIGINT NOT NULL,
   lastModifiedTime     BIGINT,
   additionaldetails    JSONB,

CONSTRAINT pk_eg_pt_property_id PRIMARY KEY(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS index_eg_pt_property_propertyId    ON eg_pt_property (propertyid, tenantid, status) where status='ACTIVE';
CREATE INDEX IF NOT EXISTS index_eg_pt_property_linkedproperties	 ON eg_pt_property (linkedproperties);
CREATE INDEX IF NOT EXISTS index_eg_pt_property_accountId        	 ON eg_pt_property (accountId);
CREATE INDEX IF NOT EXISTS index_eg_pt_property_tenantid        	 ON eg_pt_property (tenantid);
CREATE INDEX IF NOT EXISTS index_eg_pt_property_status	        	 ON eg_pt_property (status);


--> Institution

CREATE TABLE eg_pt_institution (

  id               			CHARACTER VARYING (128) NOT NULL,
  propertyid       			CHARACTER VARYING (256) NOT NULL,
  tenantId         			CHARACTER VARYING (256) NOT NULL,
  name             			CHARACTER VARYING (1024) NOT NULL,
  nameofauthorizedperson	CHARACTER VARYING (1024) NOT NULL,
  type             			CHARACTER VARYING (128) NOT NULL,
  designation      			CHARACTER VARYING (128),
  createdby        			CHARACTER VARYING (128) NOT NULL,
  createdtime      			BIGINT NOT NULL,
  lastmodifiedby   			CHARACTER VARYING (128),
  lastmodifiedtime 			BIGINT,

  CONSTRAINT pk_eg_pt_institution PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_institution FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
);

CREATE INDEX IF NOT EXISTS index_eg_pt_institution_tenantid ON eg_pt_property (tenantid);

--> Owner 

CREATE TABLE eg_pt_owner (

  ownerinfouuid		  	CHARACTER VARYING (256) NOT NULL,
  tenantid            	CHARACTER VARYING (256) NOT NULL,
  propertyid          	CHARACTER VARYING (256) NOT NULL,
  userid              	CHARACTER VARYING (128) NOT NULL,
  status              	CHARACTER VARYING (128) NOT NULL,
  isprimaryowner      	BOOLEAN,
  ownertype           	CHARACTER VARYING (256) NOT NULL,
  ownershippercentage	CHARACTER VARYING (128),
  institutionid       	CHARACTER VARYING (128),
  relationship        	CHARACTER VARYING (128),
  createdby           	CHARACTER VARYING (128) NOT NULL,
  createdtime         	BIGINT NOT NULL,
  lastmodifiedby      	CHARACTER VARYING (128),
  lastmodifiedtime    	BIGINT,


  CONSTRAINT pk_eg_pt_owner PRIMARY KEY (ownerinfouuid),
  CONSTRAINT UK_eg_pt_owner UNIQUE (userid, propertyid),
  CONSTRAINT fk_eg_pt_owner FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
  );

CREATE INDEX IF NOT EXISTS index_eg_pt_owner_tenantid   ON eg_pt_owner (tenantid);

  --> document table

CREATE TABLE eg_pt_document (

  id               CHARACTER VARYING (128) NOT NULL,
  tenantId         CHARACTER VARYING (256) NOT NULL,
  entityid         CHARACTER VARYING (256) NOT NULL,
  documentType     CHARACTER VARYING (128) NOT NULL,
  fileStoreid      CHARACTER VARYING (128) NOT NULL,
  documentuid      CHARACTER VARYING (128),
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

  tenantId          CHARACTER VARYING(256)  NOT NULL,
  id                CHARACTER VARYING(256)  NOT NULL,
  propertyid       	CHARACTER VARYING(256)  NOT NULL,
  doorno            CHARACTER VARYING(128),
  plotno            CHARACTER VARYING(256),
  buildingName     	CHARACTER VARYING(1024),
  street           	CHARACTER VARYING(1024),
  landmark         	CHARACTER VARYING(1024),
  city             	CHARACTER VARYING(512),
  pincode          	CHARACTER VARYING(16),
  locality         	CHARACTER VARYING(128)  NOT NULL,
  district          CHARACTER VARYING(256),
  region            CHARACTER VARYING(256),
  state             CHARACTER VARYING(256),
  country           CHARACTER VARYING(512),
  latitude         	NUMERIC(9,6),
  longitude        	NUMERIC(10,7),
  createdby        	CHARACTER VARYING(128)  NOT NULL,
  createdtime      	BIGINT NOT NULL,
  lastmodifiedby   	CHARACTER VARYING(128),
  lastmodifiedtime 	BIGINT,
  additionaldetails JSONB,

  CONSTRAINT pk_eg_pt_address PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_address FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
);

CREATE INDEX IF NOT EXISTS index_eg_pt_address_tenantid  ON eg_pt_address (tenantid);


CREATE TABLE eg_pt_unit (

  id               	CHARACTER VARYING(128) 	NOT NULL, 
  tenantId         	CHARACTER VARYING(256) 	NOT NULL,
  propertyid       	CHARACTER VARYING(128) 	NOT NULL,
  floorNo           BIGINT,
  unitType          CHARACTER VARYING(256),
  usageCategory     CHARACTER VARYING(2048) NOT NULL,
  occupancyType     CHARACTER VARYING(256)  NOT NULL,
  occupancyDate     BIGINT,
  carpetArea        NUMERIC (10,2),
  builtUpArea       NUMERIC (10,2),
  plinthArea        NUMERIC (10,2),
  superBuiltUpArea  NUMERIC (10,2),
  arv  				NUMERIC (10,2),
  constructionType  CHARACTER VARYING(1024),
  constructionDate  BIGINT,
  dimensions        JSON,
  active			BOOLEAN,
  createdby        	CHARACTER VARYING(128) NOT NULL,
  createdtime      	BIGINT NOT NULL,
  lastmodifiedby   	CHARACTER VARYING(128),
  lastmodifiedtime 	BIGINT,

  CONSTRAINT pk_eg_pt_unit PRIMARY KEY (id),
  CONSTRAINT fk_eg_pt_address FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id) 
);

CREATE INDEX IF NOT EXISTS index_eg_pt_unit_tenantId ON  eg_pt_unit (tenantId);


CREATE TABLE eg_pt_property_audit (

audituuid			CHARACTER VARYING(128) 	NOT NULL,
propertyid			CHARACTER VARYING(128) 	NOT NULL,
property 			JSONB	NOT NULL,
auditcreatedtime	BIGINT	NOT NULL	

);

CREATE INDEX IF NOT EXISTS index_eg_pt_property_audit_propertyid ON eg_pt_property_audit (propertyid);
