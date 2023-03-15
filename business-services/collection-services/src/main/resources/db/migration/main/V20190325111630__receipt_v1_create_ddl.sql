CREATE TABLE egcl_receiptheader_v1
(
    id character varying(36)  NOT NULL,
    payername character varying(256) ,
    payeraddress character varying(1024) ,
    payeremail character varying(254) ,
    paidby character varying(1024) ,
    referencenumber character varying(50) ,
    receipttype character varying(32)  NOT NULL,
    receiptnumber character varying(50) ,
    referencedesc character varying(250) ,
    manualreceiptnumber character varying(50) ,
    businessdetails character varying(32)  NOT NULL,
    collectiontype character varying(50)  NOT NULL,
    displaymsg character varying(256) ,
    reference_ch_id bigint,
    stateid bigint,
    location bigint,
    isreconciled boolean,
    status character varying(50)  NOT NULL,
    reasonforcancellation character varying(250) ,
    minimumamount numeric(12,2),
    totalamount numeric(12,2),
    collmodesnotallwd character varying(256) ,
    consumercode character varying(256) ,
    channel character varying(20) ,
    consumertype character varying(100) ,
    fund character varying ,
    fundsource character varying ,
    function character varying ,
    boundary character varying ,
    department character varying ,
    voucherheader character varying ,
    depositedbranch character varying ,
    version bigint NOT NULL DEFAULT 1,
    createdby character varying(256)  NOT NULL,
    lastmodifiedby character varying(256)  NOT NULL,
    tenantid character varying  NOT NULL,
    cancellationremarks character varying(256) ,
    receiptdate bigint NOT NULL,
    createddate bigint NOT NULL,
    lastmodifieddate bigint NOT NULL,
    referencedate bigint NOT NULL ,
    transactionid character varying(50) ,
    collectedamount numeric(12,2),
    manualreceiptdate bigint,
    additionaldetails jsonb,
    payermobile character varying(50) ,
    demandid character varying(256) ,
    demandfromdate bigint,
    demandtodate bigint,
    CONSTRAINT pk_egcl_receiptheader_v1 PRIMARY KEY (id)
);


CREATE TABLE egcl_receiptdetails_v1
(
    id character varying(36)  NOT NULL,
    chartofaccount character varying ,
    dramount numeric(12,2) ,
    cramount numeric(12,2) ,
    ordernumber bigint,
    receiptheader character varying(36)  NOT NULL,
    actualcramounttobepaid numeric(12,2) ,
    description character varying(500) ,
    financialyear character varying ,
    isactualdemand boolean,
    purpose character varying(50) ,
    tenantid character varying  NOT NULL,
    additionaldetails jsonb,
    amount numeric(12,2) ,
    adjustedamount numeric(12,2) ,
    demanddetailid character varying(256) ,
    taxheadcode character varying(256) ,
    CONSTRAINT pk_egcl_receiptdetails_v1 PRIMARY KEY (id),
    CONSTRAINT fk_rcptdtls_rcpthead_v1 FOREIGN KEY (receiptheader)
        REFERENCES egcl_receiptheader_v1 (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE egcl_receiptheader_v1_history
(
    id character varying(36) ,
    payername character varying(256) ,
    payeraddress character varying(1024) ,
    payeremail character varying(254) ,
    paidby character varying(1024) ,
    referencenumber character varying(50) ,
    receipttype character varying(32) ,
    receiptnumber character varying(50) ,
    referencedesc character varying(250) ,
    manualreceiptnumber character varying(50) ,
    businessdetails character varying(32) ,
    collectiontype character varying(50) ,
    displaymsg character varying(256) ,
    reference_ch_id bigint,
    stateid bigint,
    location bigint,
    isreconciled boolean,
    status character varying(50) ,
    reasonforcancellation character varying(250) ,
    minimumamount numeric(12,2),
    totalamount numeric(12,2),
    collmodesnotallwd character varying(256) ,
    consumercode character varying(256) ,
    channel character varying(20) ,
    consumertype character varying(100) ,
    fund character varying ,
    fundsource character varying ,
    function character varying ,
    boundary character varying ,
    department character varying ,
    voucherheader character varying ,
    depositedbranch character varying ,
    version bigint,
    createdby character varying(256) ,
    lastmodifiedby character varying(256) ,
    tenantid character varying(256) ,
    cancellationremarks character varying(256) ,
    receiptdate bigint,
    createddate bigint,
    lastmodifieddate bigint,
    referencedate bigint,
    transactionid character varying(50) ,
    collectedamount numeric(12,2),
    manualreceiptdate bigint,
    additionaldetails jsonb,
    payermobile character varying(50) ,
    uuid character varying(256)  NOT NULL,
    demandid character varying(256) ,
    demandfromdate bigint,
    demandtodate bigint
);

CREATE TABLE egcl_receiptdetails_v1_history
(
    id character varying(36) ,
    chartofaccount character varying ,
    dramount numeric(12,2),
    cramount numeric(12,2),
    ordernumber bigint,
    receiptheader character varying(36) ,
    actualcramounttobepaid numeric(12,2),
    description character varying(500) ,
    financialyear character varying ,
    isactualdemand boolean,
    purpose character varying(50) ,
    tenantid character varying (256),
    additionaldetails jsonb,
    amount numeric(12,2),
    adjustedamount numeric(12,2),
    uuid character varying(256)  NOT NULL,
    demanddetailid character varying(256) ,
    taxheadcode character varying(256) 
);

CREATE TABLE egcl_instrumentheader_v1
(
    id character varying(36)  NOT NULL,
    transactionnumber character varying(50)  NOT NULL,
    transactiondate bigint NOT NULL,
    amount numeric(12,2) NOT NULL,
    instrumenttype character varying(50)  NOT NULL,
    instrumentstatus character varying(50)  NOT NULL,
    bankid character varying(50) ,
    branchname character varying(50) ,
    bankaccountid character varying(50) ,
    ifsccode character varying(20) ,
    financialstatus character varying(50) ,
    transactiontype character varying(6) ,
    payee character varying(50) ,
    drawer character varying(100) ,
    surrenderreason character varying(50) ,
    serialno character varying(50) ,
    createdby character varying(50) ,
    createddate bigint NOT NULL,
    lastmodifiedby character varying(50) ,
    lastmodifieddate bigint NOT NULL,
    tenantid character varying(250) ,
    additionaldetails jsonb,
    instrumentdate bigint,
    instrumentnumber character varying(50) ,
    CONSTRAINT pk_egcl_instrumenthead_v1 PRIMARY KEY (id)
);

CREATE TABLE egcl_instrumentheader_v1_history
(
    id character varying(36) ,
    transactionnumber character varying(50) ,
    transactiondate bigint,
    amount numeric(12,2),
    instrumenttype character varying(50) ,
    instrumentstatus character varying(50) ,
    bankid character varying(50) ,
    branchname character varying(50) ,
    bankaccountid character varying(50) ,
    ifsccode character varying(20) ,
    financialstatus character varying(50) ,
    transactiontype character varying(6) ,
    payee character varying(50) ,
    drawer character varying(100) ,
    surrenderreason character varying(50) ,
    serialno character varying(50) ,
    createdby character varying(50) ,
    createddate bigint,
    lastmodifiedby character varying(50) ,
    lastmodifieddate bigint,
    tenantid character varying(250) ,
    additionaldetails jsonb,
    instrumentdate bigint,
    instrumentnumber character varying(50) ,
    uuid character varying(256)  NOT NULL
);

CREATE TABLE egcl_receiptinstrument_v1
(
    receiptheader character varying(36)  NOT NULL,
    instrumentheader character varying(36)  NOT NULL,
    CONSTRAINT fk_rcptinst_insthead FOREIGN KEY (instrumentheader)
        REFERENCES egcl_instrumentheader_v1 (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_rcptinst_rcpthead FOREIGN KEY (receiptheader)
        REFERENCES egcl_receiptheader_v1 (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

