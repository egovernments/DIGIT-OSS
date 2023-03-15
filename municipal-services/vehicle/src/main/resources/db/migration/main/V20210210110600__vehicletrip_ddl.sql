CREATE TABLE IF NOT EXISTS eg_vehicle_trip(
id character varying(64) NOT NULL,
tenantid character varying(64),
owner_id character varying(64),
driver_id character varying(64),
vehicle_id character varying(64) NOT NULL,
applicationNo character varying(64),
additionalDetails JSONB,
status character varying(64) NOT NULL,
businessService character varying(64) NOT NULL,
applicationStatus character varying(64) NOT NULL,
tripStartTime	 bigint,
tripEndTime bigint,
volumeCarried numeric(12,2),
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint,
CONSTRAINT pk_eg_vehicle_trip PRIMARY KEY (id)
);

CREATE INDEX  IF NOT EXISTS  index_owner_eg_vehicle_trip  ON eg_vehicle_trip
(    owner_id
);
CREATE INDEX  IF NOT EXISTS  index_driver_eg_vehicle_trip  ON eg_vehicle_trip
(    driver_id
);
CREATE INDEX  IF NOT EXISTS  index_vehicle_eg_vehicle_trip  ON eg_vehicle_trip
(    vehicle_id
);
CREATE INDEX  IF NOT EXISTS  index_tenant_eg_vehicle_trip  ON eg_vehicle_trip
(    tenantId
);
CREATE INDEX  IF NOT EXISTS  index_applicationNo_eg_vehicle_trip  ON eg_vehicle_trip
(    applicationNo
);
CREATE INDEX  IF NOT EXISTS  index_businessService_eg_vehicle_trip  ON eg_vehicle_trip
(    businessService
);
CREATE INDEX  IF NOT EXISTS  index_applicationStatus_eg_vehicle_trip  ON eg_vehicle_trip
(    applicationStatus
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_vehicle_trip  ON eg_vehicle_trip
(    id
);


CREATE TABLE IF NOT EXISTS eg_vehicle_trip_detail(
id character varying(64) NOT NULL,
tenantid character varying(64),
trip_id character varying(64),
referenceNo character varying(64),
referenceStatus character varying(64),
additionalDetails JSONB,
status character varying(64) NOT NULL,
itemStartTime	 bigint,
itemEndTime bigint,
volume numeric(12,2),
createdby character varying(64),
lastmodifiedby character varying(64),
createdtime bigint,
lastmodifiedtime bigint,
CONSTRAINT pk_eg_vehicle_trip_detail PRIMARY KEY (id)
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_vehicle_trip_detail  ON eg_vehicle_trip_detail
(    id
);

CREATE INDEX  IF NOT EXISTS  index_trip_id_eg_vehicle_trip_detail  ON eg_vehicle_trip_detail
(   trip_id
);


CREATE INDEX  IF NOT EXISTS  index_referenceNo_eg_vehicle_trip_detail  ON eg_vehicle_trip_detail
(   referenceNo
);