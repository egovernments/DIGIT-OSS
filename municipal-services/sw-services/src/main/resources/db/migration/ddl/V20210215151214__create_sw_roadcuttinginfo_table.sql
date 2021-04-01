CREATE TABLE IF NOT EXISTS eg_sw_roadcuttinginfo
(
  id character varying(64) NOT NULL,
  tenantid character varying(64),
  swid character varying(64),
  active character varying(64),
  roadtype character varying(32),
  roadcuttingarea FLOAT,
  createdby character varying(64),
  lastmodifiedby character varying(64),
  createdtime bigint,
  lastmodifiedtime bigint,
  CONSTRAINT uk_eg_sw_roadcuttinginfo PRIMARY KEY (id),
  CONSTRAINT fk_eg_sw_roadcuttinginfo_connection_id FOREIGN KEY (swid)
      REFERENCES eg_sw_connection (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);