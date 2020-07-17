create sequence seq_eg_checklist_type;

CREATE TABLE eg_checklist_type
(
  id bigint NOT NULL,
  code character varying(128) NOT NULL,
  description character varying(250),
  version numeric DEFAULT 0,
  createdby bigint NOT NULL,
  createddate timestamp without time zone NOT NULL,
  lastmodifiedby bigint,
  lastmodifieddate timestamp without time zone,
  CONSTRAINT pk_eg_mstr_checklist_type PRIMARY KEY (id),
  CONSTRAINT fk_eg_mstr_checklist_type_crtby FOREIGN KEY (createdby)
      REFERENCES eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_eg_mstr_checklist_type_mdfdby FOREIGN KEY (lastmodifiedby)
      REFERENCES eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);


create sequence seq_eg_checklist;

CREATE TABLE eg_checklist
(
  id bigint NOT NULL,
  checklisttypeid bigint NOT NULL,
  code character varying(150),
  description character varying(250),
  version numeric DEFAULT 0,
  createdby bigint NOT NULL,
  createddate timestamp without time zone NOT NULL,
  lastmodifiedby bigint,
  lastmodifieddate timestamp without time zone,
  CONSTRAINT pk_eg_checklist PRIMARY KEY (id),
  CONSTRAINT fk_eg_checklist_checklisttype FOREIGN KEY (checklisttypeid)
      REFERENCES eg_checklist_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_eg_checklist_crtby FOREIGN KEY (createdby)
      REFERENCES eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_eg_checklist_mdfdby FOREIGN KEY (lastmodifiedby)
      REFERENCES eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
