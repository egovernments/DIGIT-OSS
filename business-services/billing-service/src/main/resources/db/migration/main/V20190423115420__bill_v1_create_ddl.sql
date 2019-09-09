
CREATE TABLE egbs_bill_v1
(
    id character varying(64) NOT NULL,
    tenantid character varying(250) NOT NULL,
    payername character varying(256),
    payeraddress character varying(1024),
    payeremail character varying(256),
    isactive boolean,
    iscancelled boolean,
    createdby character varying(256) NOT NULL,
    createddate bigint NOT NULL,
    lastmodifiedby character varying(256),
    lastmodifieddate bigint,
    mobilenumber character varying(20),
    CONSTRAINT pk_egbs_bill_v1 PRIMARY KEY (id, tenantid)
);

CREATE INDEX IF NOT EXISTS idx_egbs_bill_v1_id ON egbs_bill_v1(id);
CREATE INDEX IF NOT EXISTS idx_egbs_bill_v1_isactive ON egbs_bill_v1(isactive);
CREATE INDEX IF NOT EXISTS idx_egbs_bill_v1_tenantid ON egbs_bill_v1(tenantid);

CREATE TABLE egbs_billdetail_v1
(
    id character varying(64) NOT NULL,
    tenantid character varying(250) NOT NULL,
    billid character varying(64) NOT NULL,
    businessservice character varying(250) NOT NULL,
    billno character varying(32),
    billdate bigint NOT NULL,
    consumercode character varying(250) NOT NULL,
    consumertype character varying(250),
    billdescription character varying(1024),
    displaymessage character varying(1024),
    minimumamount numeric(12,2),
    totalamount numeric(12,2),
    callbackforapportioning boolean,
    partpaymentallowed boolean,
    collectionmodesnotallowed character varying(512),
    createdby character varying(256) NOT NULL,
    createddate bigint NOT NULL,
    lastmodifiedby character varying(256),
    lastmodifieddate bigint,
    receiptdate bigint,
    receiptnumber character varying(256),
    fromperiod bigint,
    toperiod bigint,
    demandid character varying(64),
    isadvanceallowed boolean,
    expirydate bigint,
    CONSTRAINT pk_egbs_billdetail_v1 PRIMARY KEY (id, tenantid),
    CONSTRAINT fk_egbs_bill_v1 FOREIGN KEY (tenantid, billid) REFERENCES egbs_bill_v1 (tenantid, id) 
);

CREATE INDEX IF NOT EXISTS idx_egbs_billdetail_v1_businessservice ON egbs_billdetail_v1(businessservice);
CREATE INDEX IF NOT EXISTS idx_egbs_billdetail_v1_consumercode ON egbs_billdetail_v1(consumercode);
CREATE INDEX IF NOT EXISTS idx_egbs_billdetail_v1_tenantid ON egbs_billdetail_v1(tenantid);

CREATE TABLE egbs_billaccountdetail_v1
(
    id character varying(64) NOT NULL,
    tenantid character varying(250) NOT NULL,
    billdetail character varying(64) NOT NULL,
    glcode character varying(250),
    orderno integer,
    accountdescription character varying(512),
    creditamount numeric(12,2),
    debitamount numeric(12,2),
    isactualdemand boolean,
    purpose character varying(250),
    createdby character varying(256) NOT NULL,
    createddate bigint NOT NULL,
    lastmodifiedby character varying(256),
    lastmodifieddate bigint,
    cramounttobepaid numeric(12,2),
    taxheadcode character varying(256),
    amount numeric(10,2),
    adjustedamount numeric(10,2),
    demanddetailid character varying(64),
    CONSTRAINT pk_egbs_billaccountdetails_v1 PRIMARY KEY (id, tenantid),
    CONSTRAINT fk_egbs_billdetail_v1 FOREIGN KEY (billdetail, tenantid) REFERENCES egbs_billdetail_v1 (id, tenantid) 
);