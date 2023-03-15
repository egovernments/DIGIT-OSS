


CREATE TABLE IF NOT EXISTS  eg_fsm_application(
    id character varying(256) NOT NULL,
    applicationno character varying(128),
    tenantid character varying(64),
    additionaldetails jsonb,
    accountid character varying(64) DEFAULT NULL,
    description character varying(256) DEFAULT NULL,
    applicationStatus character varying(64) NOT NULL,
    source character varying(64) DEFAULT NULL,
    sanitationtype character varying(64) NOT NULL,
    propertyUsage character varying(64) NOT NULL,
    noOfTrips int,
    status character varying(64),
    vehicle_id character varying(64) NOT NULL,
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_fsm_application PRIMARY KEY (id) 
); 

CREATE INDEX  IF NOT EXISTS  index_appno_eg_fsm  ON eg_fsm_application
(    applicationno
);
CREATE INDEX  IF NOT EXISTS  index_acct_eg_fsm  ON eg_fsm_application
(    accountId
);
CREATE INDEX  IF NOT EXISTS  index_tenant_eg_fsm  ON eg_fsm_application
(    tenantid
);
CREATE INDEX  IF NOT EXISTS  index_santype_eg_fsm  ON eg_fsm_application
(    sanitationtype
);
CREATE INDEX  IF NOT EXISTS  index_appstatus_eg_fsm  ON eg_fsm_application
(
    applicationStatus
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm  ON eg_fsm_application
(
    id
);

CREATE INDEX  IF NOT EXISTS  index_vehicle_eg_fsm  ON eg_fsm_application
(
    vehicle_id
);

CREATE INDEX  IF NOT EXISTS  index_source_eg_fsm  ON eg_fsm_application
(
    source
);
CREATE INDEX  IF NOT EXISTS  index_property_eg_fsm  ON eg_fsm_application
(
    propertyUsage
);

CREATE TABLE IF NOT EXISTS  eg_fsm_application_auditlog(
    id character varying(64) NOT NULL,
    applicationno character varying(64),
    tenantid character varying(64),
    additionaldetails jsonb,
    accountid character varying(64) DEFAULT NULL,
    description character varying(256) DEFAULT NULL,
    applicationStatus character varying(64) NOT NULL,
    source character varying(64) DEFAULT NULL,
    sanitationtype character varying(64) NOT NULL,
    propertyUsage character varying(64) NOT NULL,
    noOfTrips int,
    status character varying(64),
    vehicle_id character varying(64) NOT NULL,
    pit_id character varying(4) NOT NULL,
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint  
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_fsmauditlog  ON eg_fsm_application_auditlog
(
    id
);


CREATE TABLE IF NOT EXISTS eg_fsm_pit_detail(

id character varying(64) NOT NULL,
tenantid character varying(64),
height double precision,
length double precision,
width double precision,
distanceFromRoad double precision,
additionalDetails JSONB,
fms_id character varying NOT NULL,
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint,
CONSTRAINT pk_eg_fsm_pit_detail PRIMARY KEY (id),
CONSTRAINT fk_eg_pit_fsm FOREIGN KEY (fms_id) REFERENCES eg_fsm_application (id)  

);


CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm_pit_detail  ON eg_fsm_pit_detail
(
  id

);

CREATE INDEX  IF NOT EXISTS  index_tenant_eg_fsm_pit_detail  ON eg_fsm_pit_detail
(
  tenantid

);


CREATE INDEX  IF NOT EXISTS  index_fsm_id_eg_fsm_pit_detail  ON eg_fsm_pit_detail
(
  fms_id

);

CREATE TABLE IF NOT EXISTS eg_fsm_pit_detail_auditlog(

id character varying(64) NOT NULL,
    tenantid character varying(64),
height double precision,
length double precision,
width double precision,
distanceFromRoad double precision,
additionalDetails JSONB,
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm_pit_detail_auditlog  ON eg_fsm_pit_detail_auditlog
(
  id

);


CREATE TABLE IF NOT EXISTS eg_fsm_address(
id character varying(64),
tenantId character varying(64) NOT NULL,
doorNo character varying(64),
plotNo character varying(64),
landmark character varying(64),
city character varying(64),
district character varying(64),
region character varying(64),
state character varying(64),
country character varying(64),
locality character varying(64),
pincode character varying(64),
    additionaldetails jsonb,
buildingName character varying(64),
street character varying(64),
fsm_id character varying(64),
createdBy character varying(64),
lastModifiedBy character varying(64),
createdTime bigint,
lastModifiedTime bigint,

CONSTRAINT pk_eg_fsm_address PRIMARY KEY (id),
CONSTRAINT fk_eg_fsm_address FOREIGN KEY (fsm_id) REFERENCES eg_fsm_application (id)
);

CREATE INDEX  IF NOT EXISTS  index_loc_eg_fsm_address  ON eg_fsm_address
(
    locality
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm_address  ON eg_fsm_address
(
    id
);
CREATE INDEX  IF NOT EXISTS  index_fsm_eg_fsm_address  ON eg_fsm_address
(
    fsm_id
);
CREATE INDEX  IF NOT EXISTS  index_tenant_eg_fsm_address  ON eg_fsm_address
(
    tenantid
);

CREATE TABLE IF NOT EXISTS eg_fsm_address_auditlog(
id character varying(64),
tenantId character varying(64) NOT NULL,
doorNo character varying(64),
plotNo character varying(64),
landmark character varying(64),
city character varying(64),
district character varying(64),
region character varying(64),
state character varying(64),
country character varying(64),
locality character varying(64),
pincode character varying(64),
    additionaldetails jsonb,
buildingName character varying(64),
street character varying(64),
fsm_id character varying(64),
createdBy character varying(64),
lastModifiedBy character varying(64),
createdTime bigint,
lastModifiedTime bigint
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm_address_auditlog  ON eg_fsm_address_auditlog
(
    id
);

CREATE TABLE IF NOT EXISTS eg_fsm_geolocation(

id character varying(64) NOT NULL,
    tenantid character varying(64),
latitude double precision,
longitude double precision,
address_id character varying(64),
additionalDetails JSONB,
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint,

CONSTRAINT pk_eg_fsm_geolocation_address PRIMARY KEY (id),
CONSTRAINT fk_eg_fsm_geolocation_address FOREIGN KEY (address_id) REFERENCES eg_fsm_address (id)
);

CREATE INDEX  IF NOT EXISTS  index_add_eg_fsm_geolocation  ON eg_fsm_geolocation
(
    address_id

);
CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm_geolocation  ON eg_fsm_geolocation
(
    id

);

CREATE TABLE IF NOT EXISTS eg_fsm_geolocation_auditlog(

id character varying(64) NOT NULL,
    tenantid character varying(64),
latitude double precision,
longitude double precision,
address_id character varying(64),
additionalDetails JSONB,
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint
);


CREATE INDEX  IF NOT EXISTS  index_id_eg_fsm_geolocation_auditlog  ON eg_fsm_geolocation_auditlog
(
    id
);

