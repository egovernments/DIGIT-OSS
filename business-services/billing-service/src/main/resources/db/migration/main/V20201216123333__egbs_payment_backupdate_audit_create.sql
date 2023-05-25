CREATE TABLE egbs_payment_backupdate_audit 
(
    paymentid character varying(256) NOT NULL,
    
	isbackupdatesuccess Boolean NOT NULL,
	
	isreceiptcancellation Boolean NOT NULL,
	
	errorMessage character varying
);

CREATE UNIQUE INDEX uk_egbs_payment_backupdate_audit ON egbs_payment_backupdate_audit (paymentid, isreceiptcancellation) WHERE isbackupdatesuccess='TRUE';
 