CREATE TABLE egcl_remittancereceipt
(
  id character varying(250) NOT NULL,
  remittance character varying(250) NOT NULL,
  receipt character varying(250) NOT NULL,
  tenantid character varying(252) NOT NULL,
  CONSTRAINT pk_egcl_remittancereceipt PRIMARY KEY (id)
 );