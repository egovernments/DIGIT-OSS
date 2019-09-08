CREATE TABLE egbs_demand_v1
(
    id character varying(64) NOT NULL,
    consumercode character varying(250) NOT NULL,
    consumertype character varying(250) NOT NULL,
    businessservice character varying(250) NOT NULL,
    payer character varying(250),
    taxperiodfrom bigint NOT NULL,
    taxperiodto bigint NOT NULL,
    createdby character varying(256) NOT NULL,
    createdtime bigint NOT NULL,
    lastmodifiedby character varying(256),
    lastmodifiedtime bigint,
    tenantid character varying(250) NOT NULL,
    minimumamountpayable numeric(12,2),
    status character varying(64),
    additionaldetails json,
    CONSTRAINT pk_egbs_demand_v1 PRIMARY KEY (id, tenantid),
    CONSTRAINT uk_egbs_demand_v1_consumercode_businessservice UNIQUE (consumercode, tenantid, taxperiodfrom, taxperiodto, businessservice)
);

CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_id ON egbs_demand_v1(id);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_consumercode ON egbs_demand_v1(consumercode);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_consumertype ON egbs_demand_v1(consumertype);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_businessservice ON egbs_demand_v1(businessservice);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_payer ON egbs_demand_v1(payer);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_taxperiodfrom ON egbs_demand_v1(taxperiodfrom);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_taxperiodto ON egbs_demand_v1(taxperiodto);
CREATE INDEX IF NOT EXISTS idx_egbs_demand_v1_tenantid ON egbs_demand_v1(tenantid);

CREATE TABLE egbs_demanddetail_v1
(
    id character varying(64) NOT NULL,
    demandid character varying(64) NOT NULL,
    taxheadcode character varying(250) NOT NULL,
    taxamount numeric(12,2)NOT NULL,
    collectionamount numeric(12,2)NOT NULL,
    createdby character varying(256) NOT NULL,
    createdtime bigint NOT NULL,
    lastmodifiedby character varying(256),
    lastmodifiedtime bigint,
    tenantid character varying(250) NOT NULL,
    additionaldetails json,
    CONSTRAINT pk_egbs_demanddetail_v1 PRIMARY KEY (id, tenantid),
    CONSTRAINT fk_egbs_demanddetail_v1 FOREIGN KEY (tenantid, demandid) REFERENCES egbs_demand_v1 (tenantid, id)
);

CREATE INDEX IF NOT EXISTS idx_egbs_demanddetail_v1_tenantid ON egbs_demanddetail_v1(tenantid);
CREATE INDEX IF NOT EXISTS idx_egbs_demanddetail_v1_demandid ON egbs_demanddetail_v1(demandid);

CREATE TABLE egbs_demand_v1_audit
(
    id character varying(64) NOT NULL,
    demandid character varying(64) NOT NULL,
    consumercode character varying(250) NOT NULL,
    consumertype character varying(250) NOT NULL,
    businessservice character varying(250) NOT NULL,
    payer character varying(250),
    taxperiodfrom bigint NOT NULL,
    taxperiodto bigint NOT NULL,
    createdby character varying(256) NOT NULL,
    createdtime bigint NOT NULL,
    tenantid character varying(250) NOT NULL,
    minimumamountpayable numeric(12,2),
    status character varying(64),
    additionaldetails json,
    CONSTRAINT pk_egbs_demand_v1_audit PRIMARY KEY (id, tenantid)
);

CREATE TABLE egbs_demanddetail_v1_audit
(
    id character varying(64) NOT NULL,
    demandid character varying(64) NOT NULL,
    demanddetailid character varying(64) NOT NULL,
    taxheadcode character varying(250) NOT NULL,
    taxamount numeric(12,2)NOT NULL,
    collectionamount numeric(12,2)NOT NULL,
    createdby character varying(256) NOT NULL,
    createdtime bigint NOT NULL,
    tenantid character varying(250) NOT NULL,
    additionaldetails json,
    CONSTRAINT pk_egbs_demanddetail_v1_audit PRIMARY KEY (id, tenantid)
);