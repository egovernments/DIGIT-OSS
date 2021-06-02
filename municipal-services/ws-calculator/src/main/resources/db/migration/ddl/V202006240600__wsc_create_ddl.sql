CREATE TABLE IF NOT EXISTS eg_ws_meterreading
(
  id character varying(64),
  connectionNo character varying(64),
  billingPeriod character varying(64) NOT NULL,
  meterStatus character varying(64) NOT NULL,
  lastReading decimal NOT NULL,
  lastReadingDate bigint NOT NULL,
  currentReading decimal NOT NULL,
  currentReadingDate bigint NOT NULL,
  consumption decimal,
  createdBy character varying(64),
  lastModifiedBy character varying(64),
  createdTime bigint,
  lastModifiedTime bigint,
  tenantid character varying(64),
  CONSTRAINT uk_eg_ws_meterreading UNIQUE (id)
);

CREATE INDEX IF NOT EXISTS index_eg_ws_meterreading_tenantId ON eg_ws_meterreading (tenantid);
CREATE INDEX IF NOT EXISTS index_eg_ws_meterreading_connectionNo ON eg_ws_meterreading (connectionNo);