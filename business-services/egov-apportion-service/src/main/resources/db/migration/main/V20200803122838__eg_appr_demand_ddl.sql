CREATE TABLE eg_appr_demand_request(
demandId character varying(128),
tenantId character varying(128),
consumerCode character varying(128),
taxperiodfrom bigint,
taxperiodto bigint,
"status" character varying(128),
demandDetails JSONB,
createdBy character varying(64),
createdTime bigint
);

CREATE TABLE eg_appr_demand_response(
demandId character varying(128),
tenantId character varying(128),
consumerCode character varying(128),
taxperiodfrom bigint,
taxperiodto bigint,
"status" character varying(128),
demandDetails JSONB,
createdBy character varying(64),
createdTime bigint
);