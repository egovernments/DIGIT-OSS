CREATE TABLE eg_pgr_service_v2(

id                  character varying(64),
tenantId            character varying(256),
serviceCode         character varying(256)  NOT NULL,
serviceRequestId    character varying(256),
description         character varying(4000) NOT NULL,
accountId           character varying(256),
additionalDetails   JSONB,
applicationStatus   character varying(128),
rating              smallint,
source              character varying(256),
createdby           character varying(256)  NOT NULL,
createdtime         bigint                  NOT NULL,
lastmodifiedby      character varying(256),
lastmodifiedtime    bigint,
CONSTRAINT uk_eg_pgr_service_v2 UNIQUE (id),
CONSTRAINT pk_eg_pgr_serviceReq_v2 PRIMARY KEY (tenantId,serviceRequestId)
);

CREATE TABLE eg_pgr_address_v2 (

tenantId          CHARACTER VARYING(256)  NOT NULL,
id                CHARACTER VARYING(256)  NOT NULL,
parentid         	CHARACTER VARYING(256)  NOT NULL,
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

CONSTRAINT pk_eg_pgr_address_v2 PRIMARY KEY (id),
CONSTRAINT fk_eg_pgr_address_v2 FOREIGN KEY (parentid) REFERENCES eg_pgr_service_v2 (id)
);


