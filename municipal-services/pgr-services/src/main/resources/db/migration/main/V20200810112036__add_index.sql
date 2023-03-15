CREATE INDEX IF NOT EXISTS index_eg_pgr_service_v2_tenantId_serviceRequestId ON eg_pgr_service_v2 (tenantId,serviceRequestId);
CREATE INDEX IF NOT EXISTS index_eg_pgr_service_v2_id ON eg_pgr_service_v2 (id);
CREATE INDEX IF NOT EXISTS index_eg_pgr_service_v2_applicationStatus ON eg_pgr_service_v2 (applicationStatus);
CREATE INDEX IF NOT EXISTS index_eg_pgr_service_v2_serviceCode ON eg_pgr_service_v2 (serviceCode);
CREATE INDEX IF NOT EXISTS index_eg_pgr_service_v2_accountId ON eg_pgr_service_v2 (accountId);

