DROP TABLE IF EXISTS "egcl_receiptheader" CASCADE;
DROP INDEX IF EXISTS idx_rcpthd_consumercode;
DROP INDEX IF EXISTS idx_rcpthd_createdby;
DROP INDEX IF EXISTS idx_rcpthd_createddate;
DROP INDEX IF EXISTS idx_rcpthd_mreceiptnumber;
DROP INDEX IF EXISTS idx_rcpthd_refno;
DROP INDEX IF EXISTS idx_rcpthd_business;
DROP INDEX IF EXISTS idx_rcpthd_status;
DROP TABLE IF EXISTS "egcl_receiptdetails";
DROP TABLE IF EXISTS "egcl_receiptinstrument";
DROP TABLE IF EXISTS "egcl_instrumentheader";
DROP INDEX IF EXISTS idx_ins_transactionnumber;


CREATE TABLE "egcl_receiptheader" (
	"id" VARCHAR(36) NOT NULL,
	"payeename" VARCHAR(256) NULL DEFAULT NULL,
	"payeeaddress" VARCHAR(1024) NULL DEFAULT NULL,
	"payeeemail" VARCHAR(254) NULL DEFAULT NULL,
	"paidby" VARCHAR(1024) NULL DEFAULT NULL,
	"referencenumber" VARCHAR(50) NULL DEFAULT NULL,
	"receipttype" VARCHAR(32) NOT NULL,
	"receiptnumber" VARCHAR(50) NULL DEFAULT NULL,
	"referencedesc" VARCHAR(250) NULL DEFAULT NULL,
	"manualreceiptnumber" VARCHAR(50) NULL DEFAULT NULL,
	"businessdetails" VARCHAR(32) NOT NULL,
	"collectiontype" VARCHAR(50) NOT NULL,
	"displaymsg" VARCHAR(256) NULL DEFAULT NULL,
	"reference_ch_id" BIGINT NULL DEFAULT NULL,
	"stateid" BIGINT NULL DEFAULT NULL,
	"location" BIGINT NULL DEFAULT NULL,
	"isreconciled" BOOLEAN NULL DEFAULT NULL,
	"status" VARCHAR(50) NOT NULL,
	"reasonforcancellation" VARCHAR(250) NULL DEFAULT NULL,
	"minimumamount" NUMERIC(12,2) NULL DEFAULT NULL,
	"totalamount" NUMERIC(12,2) NULL DEFAULT NULL,
	"collmodesnotallwd" VARCHAR(256) NULL DEFAULT NULL,
	"consumercode" VARCHAR(256) NULL DEFAULT NULL,
	"channel" VARCHAR(20) NULL DEFAULT NULL,
	"consumertype" VARCHAR(100) NULL DEFAULT NULL,
	"fund" VARCHAR NULL DEFAULT NULL,
	"fundsource" VARCHAR NULL DEFAULT NULL,
	"function" VARCHAR NULL DEFAULT NULL,
	"boundary" VARCHAR NULL DEFAULT NULL,
	"department" VARCHAR NULL DEFAULT NULL,
	"voucherheader" VARCHAR NULL DEFAULT NULL,
	"depositedbranch" VARCHAR NULL DEFAULT NULL,
	"version" BIGINT NOT NULL DEFAULT E'1',
	"createdby" BIGINT NOT NULL,
	"lastmodifiedby" BIGINT NOT NULL,
	"tenantid" VARCHAR NOT NULL,
	"cancellationremarks" VARCHAR(256) NULL DEFAULT NULL,
	"receiptdate" BIGINT NOT NULL,
	"createddate" BIGINT NOT NULL,
	"lastmodifieddate" BIGINT NOT NULL,
	"referencedate" BIGINT NOT NULL DEFAULT E'100',
	"transactionid" VARCHAR(32) NULL DEFAULT NULL,
	CONSTRAINT pk_egcl_receiptheader PRIMARY KEY (id)
);


CREATE INDEX idx_rcpthd_consumercode ON egcl_receiptheader(consumercode);
CREATE INDEX idx_rcpthd_transactionid ON egcl_receiptheader(transactionid);
CREATE INDEX idx_rcpthd_mreceiptnumber ON egcl_receiptheader(manualreceiptnumber);
CREATE INDEX idx_rcpthd_refno ON egcl_receiptheader(referencenumber);
CREATE INDEX idx_rcpthd_business ON egcl_receiptheader(businessdetails);
CREATE INDEX idx_rcpthd_status ON egcl_receiptheader(status);


CREATE TABLE "egcl_receiptdetails" (
	"id" VARCHAR(36) NOT NULL,
	"chartofaccount" VARCHAR NOT NULL,
	"dramount" NUMERIC(12,2) NULL DEFAULT NULL,
	"cramount" NUMERIC(12,2) NULL DEFAULT NULL,
	"ordernumber" BIGINT NULL DEFAULT NULL,
	"receiptheader" VARCHAR(36) NOT NULL,
	"actualcramounttobepaid" NUMERIC(12,2) NULL DEFAULT NULL,
	"description" VARCHAR(500) NULL DEFAULT NULL,
	"financialyear" VARCHAR NULL DEFAULT NULL,
	"isactualdemand" BOOLEAN NULL DEFAULT NULL,
	"purpose" VARCHAR(50) NOT NULL,
	"tenantid" VARCHAR NOT NULL,
	CONSTRAINT pk_egcl_receiptdetails PRIMARY KEY (id),
    CONSTRAINT fk_rcptdtls_rcpthead FOREIGN KEY (receiptheader)
        REFERENCES egcl_receiptheader (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE "egcl_instrumentheader" (
  id VARCHAR(36) NOT NULL,
  transactionNumber varchar(50) NOT NULL,
  transactionDate BIGINT NOT NULL,
  amount numeric (12,2) NOT NULL,
  instrumentType varchar(50) NOT NULL,
  instrumentStatus varchar(50) NOT NULL,
  bankId varchar(50),
  branchName varchar(50),
  bankAccountId varchar(50),
  ifscCode varchar(20),
  financialStatus varchar(50),
  transactionType varchar(6),
  payee varchar(50),
  drawer varchar(100),
  surrenderReason varchar(50),
  serialNo varchar(50),
  createdby varchar(50),
  createddate BIGINT NOT NULL,
  lastmodifiedby varchar(50),
  lastmodifieddate BIGINT NOT NULL,
  tenantId varchar(250),
  CONSTRAINT pk_egcl_instrumenthead PRIMARY KEY (id)
);

CREATE INDEX idx_ins_transactionnumber ON egcl_instrumentheader(transactionNumber);


CREATE TABLE EGCL_RECEIPTINSTRUMENT (
  RECEIPTHEADER VARCHAR(36) NOT NULL,
  INSTRUMENTHEADER VARCHAR(36) NOT NULL,
  CONSTRAINT FK_RCPTINST_RCPTHEAD FOREIGN KEY (RECEIPTHEADER)
        REFERENCES EGCL_RECEIPTHEADER (ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
  CONSTRAINT FK_RCPTINST_INSTHEAD FOREIGN KEY (INSTRUMENTHEADER)
        REFERENCES EGCL_INSTRUMENTHEADER (ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);