CREATE TABLE IF NOT EXISTS  eg_vendor(
    id character varying(256) NOT NULL,
    name character varying(128),
    tenantid character varying(64),
    additionaldetails jsonb,
    owner_id character varying(64) NOT NULL,
    description character varying(256) DEFAULT NULL,
    source character varying(64) DEFAULT NULL,
    status character varying(64),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_vendor PRIMARY KEY (id)
);


CREATE INDEX  IF NOT EXISTS  index_acct_eg_vendor  ON eg_vendor
(    owner_id
);
CREATE INDEX  IF NOT EXISTS  index_tenant_eg_vendor  ON eg_vendor
(    tenantid
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_vendor  ON eg_vendor
(
    id
);
CREATE INDEX  IF NOT EXISTS  index_source_eg_vendor  ON eg_vendor
(
    source
);

CREATE TABLE IF NOT EXISTS  eg_vendor_auditlog(
    id character varying(256) NOT NULL,
    name character varying(128),
    tenantid character varying(64),
    additionaldetails jsonb,
    owner_id character varying(64) NOT NULL,
    description character varying(256) DEFAULT NULL,
    source character varying(64) DEFAULT NULL,
    status character varying(64),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_vendor_auditlog  ON eg_vendor_auditlog
(
    id
);


CREATE TABLE IF NOT EXISTS eg_vendor_address(
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
vendor_id character varying(64),
createdBy character varying(64),
lastModifiedBy character varying(64),
createdTime bigint,
lastModifiedTime bigint,

CONSTRAINT pk_eg_vendor_address PRIMARY KEY (id),
CONSTRAINT fk_eg_vendor_address FOREIGN KEY (vendor_id) REFERENCES eg_vendor (id)
);

CREATE INDEX  IF NOT EXISTS  index_loc_eg_vendor_address  ON eg_vendor_address
(
    locality
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_vendor_address  ON eg_vendor_address
(
    id
);
CREATE INDEX  IF NOT EXISTS  index_vendor_eg_vendor_address  ON eg_vendor_address
(
    vendor_id
);
CREATE INDEX  IF NOT EXISTS  index_tenant_eg_vendor_address  ON eg_vendor_address
(
    tenantid
);

CREATE TABLE IF NOT EXISTS eg_vendor_address_auditlog(
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
vendor_id character varying(64),
createdBy character varying(64),
lastModifiedBy character varying(64),
createdTime bigint,
lastModifiedTime bigint
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_vendor_address_auditlog  ON eg_vendor_address_auditlog
(
    id
);



CREATE TABLE IF NOT EXISTS eg_vendor_vehicle(
vendor_id character varying(64) NOT NULL,
vechile_id character varying(64) NOT NULL,
CONSTRAINT fk_eg_vendor_vehicle FOREIGN KEY (vendor_id) REFERENCES eg_vendor (id)
);


CREATE INDEX  IF NOT EXISTS  index_vendor_eg_vendor_vehicle  ON eg_vendor_vehicle
(
    vendor_id
);
CREATE INDEX  IF NOT EXISTS  index_vehicle_eg_vendor_vehicle  ON eg_vendor_vehicle
(
    vechile_id
);


CREATE TABLE IF NOT EXISTS eg_vendor_driver(
vendor_id character varying(64) NOT NULL,
driver_id character varying(64) NOT NULL,


CONSTRAINT fk_eg_vendor_driver FOREIGN KEY (vendor_id) REFERENCES eg_vendor (id)
);


CREATE INDEX  IF NOT EXISTS  index_vendor_eg_vendor_driver  ON eg_vendor_driver
(
    vendor_id
);
CREATE INDEX  IF NOT EXISTS  index_driver_eg_vendor_driver  ON eg_vendor_driver
(
    driver_id
);

