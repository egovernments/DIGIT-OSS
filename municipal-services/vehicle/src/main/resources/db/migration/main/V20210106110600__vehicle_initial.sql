CREATE TABLE IF NOT EXISTS eg_vehicle(
id character varying(64) NOT NULL,
tenantid character varying(64),
registrationNumber character varying(128),
model character varying(256),
type character varying(64),
tankcapicity int,
suctionType character varying(64),
pollutionCertiValidTill bigint,
InsuranceCertValidTill bigint,
fitnessValidTill bigint,
roadTaxPaidTill bigint,
gpsEnabled boolean,
source character varying(64),
status character varying(64),
owner_id character varying(64) NOT NULL,
additionalDetails JSONB,
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint,
CONSTRAINT pk_eg_vehicle PRIMARY KEY (id)
);

CREATE INDEX index_id_eg_vehicle ON eg_vehicle
(id);

CREATE INDEX index_regnum_eg_vehicle ON eg_vehicle
(registrationNumber);

CREATE INDEX index_owner_eg_vehicle ON eg_vehicle
(owner_id);

CREATE INDEX eg_vehicle_suctype_index ON eg_vehicle
(suctionType);

CREATE INDEX eg_vehicle_status_index ON eg_vehicle
(status);

CREATE INDEX index_tenant_eg_vehicle ON eg_vehicle
(tenantid);

CREATE TABLE IF NOT EXISTS eg_vehicle_auditlog(
id character varying(64) NOT NULL,
tenantid character varying(64),
registrationNumber character varying(128),
model character varying(256),
type character varying(64),
tankcapicity int,
suctionType character varying(64),
pollutionCertiValidTill bigint,
InsuranceCertValidTill bigint,
fitnessValidTill bigint,
roadTaxPaidTill bigint,
gpsEnabled boolean,
source character varying(64),
status character varying(64),
owner_id character varying(64) NOT NULL,
additionalDetails JSONB,
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint
);
CREATE INDEX index_id_eg_vehicle_auditlog ON eg_vehicle_auditlog
(id);