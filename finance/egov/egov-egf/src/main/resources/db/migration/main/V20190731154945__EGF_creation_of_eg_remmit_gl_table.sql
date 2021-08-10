CREATE TABLE eg_remittance_gl
(
  id bigint NOT NULL,
  glid bigint NOT NULL,
  glamt numeric(13,2),
  lastmodifieddate timestamp without time zone,
  remittedamt numeric(13,2),
  tdsid bigint,
  FOREIGN KEY (tdsid) REFERENCES tds (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (glid) REFERENCES GENERALLEDGER (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE SEQUENCE seq_eg_remittance_gl
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE ONLY eg_remittance_gl ADD CONSTRAINT eg_remittance_gl_pkey PRIMARY KEY (id);