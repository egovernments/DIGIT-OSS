CREATE TABLE egcl_onlinepayments
(
  id bigint NOT NULL,
  collectionheader bigint NOT NULL,
  servicedetails bigint NOT NULL,
  transactionnumber character varying(50),
  transactionamount double precision,
  transactiondate timestamp without time zone,
  status bigint,
  authorisation_statuscode character varying(50),
  remarks character varying(256),
  version bigint NOT NULL DEFAULT 1,
  createdby bigint NOT NULL,
  lastmodifiedby bigint NOT NULL,
  createddate timestamp without time zone,
  lastmodifieddate timestamp without time zone,
  CONSTRAINT pk_egcl_onlinepayments PRIMARY KEY (id),
  CONSTRAINT fk_onpay_collhead FOREIGN KEY (collectionheader) REFERENCES egcl_collectionheader (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_onpay_service FOREIGN KEY (servicedetails) REFERENCES egcl_servicedetails (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_onpay_status FOREIGN KEY (status) REFERENCES egw_status (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX INDX_ONLINE_COLLHEADER ON EGCL_ONLINEPAYMENTS (COLLECTIONHEADER);
CREATE INDEX INDX_ONLINE_STATUS ON EGCL_ONLINEPAYMENTS (STATUS);
CREATE INDEX INDX_ONLINE_SERVICE ON EGCL_ONLINEPAYMENTS (SERVICEDETAILS);

CREATE SEQUENCE seq_egcl_onlinepayments;

CREATE TABLE egcl_remittance_instrument
(
  id bigint NOT NULL,
  remittance bigint,
  instrumentheader bigint,
  reconciled boolean default false,
  createdby bigint NOT NULL,
  createddate timestamp without time zone,
  lastmodifiedby bigint NOT NULL,
  lastmodifieddate timestamp without time zone,
  CONSTRAINT pk_remittance_instrument PRIMARY KEY (id),
  CONSTRAINT fk_remit_remittance FOREIGN KEY (remittance) REFERENCES egcl_remittance (id),
  CONSTRAINT fk_remit_instrument FOREIGN KEY (instrumentheader) REFERENCES egf_instrumentheader (id)
);

CREATE INDEX idx_remit_remittance on egcl_remittance_instrument (remittance);
CREATE INDEX idx_remit_instrument on egcl_remittance_instrument (instrumentheader);

CREATE SEQUENCE seq_egcl_remittance_instrument;
