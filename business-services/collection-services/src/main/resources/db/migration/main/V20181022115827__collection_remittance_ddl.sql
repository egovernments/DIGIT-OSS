CREATE TABLE egcl_remittance
(
  id character varying(250) NOT NULL,
  referencenumber character varying(50) NOT NULL,
  referencedate bigint NOT NULL,
  voucherheader character varying(250),
  fund character varying(250),
  function character varying(250),
  remarks character varying(250),
  reasonfordelay character varying(250),
  status character varying(250) NOT NULL,
  createdby bigint NOT NULL,
  createddate bigint,
  lastmodifiedby bigint NOT NULL,
  lastmodifieddate bigint,
  bankaccount character varying(250),
  tenantid character varying(252) NOT NULL,
  CONSTRAINT pk_egcl_remittance PRIMARY KEY (id)
 );
 
 CREATE TABLE egcl_remittancedetails
(
  id character varying(250) NOT NULL,
  remittance character varying(250) NOT NULL,
  chartofaccount character varying(250) NOT NULL,
  creditamount double precision,
  debitamount double precision,
  tenantid character varying(252) NOT NULL,
  CONSTRAINT pk_egcl_remittancedetails PRIMARY KEY (id)
 );
 
  CREATE TABLE egcl_remittanceinstrument
(
  id character varying(250) NOT NULL,
  remittance character varying(250) NOT NULL,
  instrument character varying(250) NOT NULL,
  reconciled boolean DEFAULT false,
  tenantid character varying(252) NOT NULL,
  CONSTRAINT pk_egcl_remittanceinstrument PRIMARY KEY (id)
 );