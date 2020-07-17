CREATE SEQUENCE IF NOT EXISTS state.seq_egdcr_layername;
CREATE TABLE IF NOT EXISTS state.egdcr_layername
(
  id bigint NOT NULL,
  key character varying(250),
  value character varying(250),
  createdby bigint NOT NULL,
  createddate timestamp without time zone NOT NULL,
  lastmodifieddate timestamp without time zone,
  lastmodifiedby bigint,
  version numeric NOT NULL,
  CONSTRAINT pk_egdcr_layername PRIMARY KEY (id),
  CONSTRAINT fk_egdcr_layername_createdby FOREIGN KEY (createdby)
      REFERENCES state.eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_egdcr_layername_lastmodifiedby FOREIGN KEY (lastmodifiedby)
      REFERENCES state.eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);