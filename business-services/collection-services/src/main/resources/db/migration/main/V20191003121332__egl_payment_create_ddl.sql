CREATE TABLE egcl_payment (
  	id VARCHAR(256) NOT NULL,
  	tenantId VARCHAR(256) NOT NULL,
  	totalDue BIGINT NOT NULL,
  	totalAmountPaid BIGINT NOT NULL,
  	transactionNumber VARCHAR(256) NOT NULL,
  	transactionDate BIGINT NOT NULL,
  	paymentMode VARCHAR(64) NOT NULL,
  	instrumentDate BIGINT NOT NULL,
  	instrumentNumber VARCHAR(256) NOT NULL,
  	ifscCode VARCHAR(64) NOT NULL,
  	additionalDetails JSONB,
  	paidBy VARCHAR(256) ,
  	mobileNumber VARCHAR(64) NOT NULL,
  	payerName VARCHAR(256) NOT NULL,
  	payerAddress VARCHAR(1024) NOT NULL,
  	payerEmail VARCHAR(256) NOT NULL,
  	payerId VARCHAR(256) NOT NULL,
  	paymentStatus VARCHAR(256) NOT NULL,
  	createdBy VARCHAR(256) NOT NULL,
  	createdDate BIGINT NOT NULL,
  	lastModifiedBy VARCHAR(256) NOT NULL,
  	lastModifiedDate BIGINT NOT NULL,

	CONSTRAINT pk_egcl_payment PRIMARY KEY (id)

);

CREATE INDEX IF NOT EXISTS idx_egcl_payment_transactionNumber ON egcl_payment(transactionNumber);
CREATE INDEX IF NOT EXISTS idx_egcl_payment_payerId ON egcl_payment(payerId);
CREATE INDEX IF NOT EXISTS idx_egcl_payment_mobileNumber ON egcl_payment(mobileNumber);



CREATE TABLE egcl_paymentDetail (
    id VARCHAR(256) NOT NULL,
  	tenantId VARCHAR(256) NOT NULL,
  	paymentid VARCHAR(256) NOT NULL,
  	due BIGINT NOT NULL,
  	amountPaid BIGINT NOT NULL,
  	receiptNumber VARCHAR(256) NOT NULL,
  	businessService VARCHAR(256) NOT NULL,
  	billId VARCHAR(256) NOT NULL,
  	paymentDetailStatus VARCHAR(256) NOT NULL,
	additionalDetails JSONB,
	createdBy VARCHAR(256) NOT NULL,
  	createdDate BIGINT NOT NULL,
  	lastModifiedBy VARCHAR(256) NOT NULL,
  	lastModifiedDate BIGINT NOT NULL,

  	CONSTRAINT pk_egcl_paymentDetail PRIMARY KEY (id),
    CONSTRAINT fk_egcl_paymentDetail FOREIGN KEY (paymentid) REFERENCES egcl_payment(id)

  	ON UPDATE CASCADE
	ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_egcl_paymentDetail_receiptNumber ON egcl_paymentDetail(receiptNumber);
CREATE INDEX IF NOT EXISTS idx_egcl_paymentDetail_billId ON egcl_paymentDetail(billId);



CREATE TABLE egcl_payment_taxhead (
    id VARCHAR(256) NOT NULL,
  	tenantId VARCHAR(256) NOT NULL,
  	paymentdetailid VARCHAR(256) NOT NULL,
  	billDetailid VARCHAR(256) NOT NULL,
	demandDetailId VARCHAR(256) NOT NULL,
  	"order" Integer NOT NULL,
  	amount BIGINT NOT NULL,
  	isActualDemand Boolean NOT NULL,
  	taxHeadCode VARCHAR(256) NOT NULL,
	additionalDetails JSONB,
	createdBy VARCHAR(256) NOT NULL,
  	createdDate BIGINT NOT NULL,
  	lastModifiedBy VARCHAR(256) NOT NULL,
  	lastModifiedDate BIGINT NOT NULL,

  	CONSTRAINT pk_egcl_payment_taxhead PRIMARY KEY (id),
    CONSTRAINT fk_egcl_payment_taxhead FOREIGN KEY (paymentdetailid) REFERENCES egcl_paymentDetail(id)

  	ON UPDATE CASCADE
	ON DELETE CASCADE
);