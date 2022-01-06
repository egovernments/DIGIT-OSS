
ALTER TABLE egbs_demand DROP CONSTRAINT uk_egbs_demand_consumercode_businessservice,
 ADD CONSTRAINT uk_egbs_demand_consumercode_businessservice UNIQUE (consumercode, tenantid, taxperiodfrom, taxperiodto, businessservice);