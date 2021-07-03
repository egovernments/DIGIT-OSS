drop table if exists edcredcrapplication;

CREATE TABLE edcr_application
(
  id bigint not null,
	applicationNumber character varying(128) not null,
	dcrNumber  character varying(128) ,
	applicationDate DATE not null,
	planinfoid bigint,
  createdby bigint NOT NULL,
  createddate TIMESTAMP without TIME ZONE NOT NULL,
  lastmodifieddate TIMESTAMP without TIME ZONE ,
  lastmodifiedby bigint,
	version numeric DEFAULT 0,
	CONSTRAINT pk_edcr_application_id PRIMARY KEY (id),
  CONSTRAINT fk_edcr_application_mdfdby FOREIGN KEY (lastmodifiedby)
  REFERENCES EG_USER (id),
  CONSTRAINT fk_edcr_application_crtedby FOREIGN KEY (createdby)
  REFERENCES EG_USER (id),
  CONSTRAINT fk_edcr_planinfo_id FOREIGN KEY (planinfoid)
  REFERENCES edcr_planinfo (id)
) ;

CREATE SEQUENCE SEQ_EDCR_APPLICATION;

