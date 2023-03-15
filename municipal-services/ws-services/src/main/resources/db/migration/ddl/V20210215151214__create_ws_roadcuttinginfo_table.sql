CREATE TABLE IF NOT EXISTS eg_ws_roadcuttinginfo
(
  id character varying(64) NOT NULL,
  tenantid character varying(64),
  wsid character varying(64),
  active character varying(64),
  roadtype character varying(32),
  roadcuttingarea FLOAT,
  createdby character varying(64),
  lastmodifiedby character varying(64),
  createdtime bigint,
  lastmodifiedtime bigint,
  CONSTRAINT uk_eg_ws_roadcuttinginfo PRIMARY KEY (id),
  CONSTRAINT fk_eg_ws_roadcuttinginfo_connection_id FOREIGN KEY (wsid)
      REFERENCES eg_ws_connection (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);