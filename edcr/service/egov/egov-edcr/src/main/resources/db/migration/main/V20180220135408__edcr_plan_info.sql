CREATE TABLE edcr_planinfo
(
  id bigint not null,
	plotarea bigint,
	ownername character varying (256),
	architectname character varying (256),
	occupancy character varying (256),
	crzzonearea boolean default false,
  createdby bigint NOT NULL,
  createddate TIMESTAMP without TIME ZONE NOT NULL,
  lastmodifieddate TIMESTAMP without TIME ZONE ,
  lastmodifiedby bigint,
	version numeric DEFAULT 0,
	CONSTRAINT pk_edcr_planinfo_id PRIMARY KEY (id),
  CONSTRAINT fk_edcr_planinfo_mdfdby FOREIGN KEY (lastmodifiedby)
  REFERENCES EG_USER (id),
  CONSTRAINT fk_edcr_planinfo_crtedby FOREIGN KEY (createdby)
  REFERENCES EG_USER (id)
) ;

CREATE SEQUENCE SEQ_EDCR_PLANINFO;

