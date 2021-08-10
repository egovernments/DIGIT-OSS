CREATE TABLE egcl_collectionmis
(
  id bigint NOT NULL,
  fund bigint NOT NULL,
  fundsource bigint,
  boundary bigint,
  department character varying(80) NOT NULL,
  scheme bigint,
  subscheme bigint,
  collectionheader bigint NOT NULL,
  functionary bigint,
  depositedbranch bigint,
  CONSTRAINT pk_egcl_collectionmis PRIMARY KEY (id),
  CONSTRAINT fk_collmis_bankbranch FOREIGN KEY (depositedbranch)
      REFERENCES bankbranch (id)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_boundary FOREIGN KEY (boundary)
      REFERENCES eg_boundary (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_collhead FOREIGN KEY (collectionheader)
      REFERENCES egcl_collectionheader (id) 
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_fund FOREIGN KEY (fund)
      REFERENCES fund (id) 
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_fundsource FOREIGN KEY (fundsource)
      REFERENCES fundsource (id)
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_funtionary FOREIGN KEY (functionary)
      REFERENCES functionary (id) 
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_scheme FOREIGN KEY (scheme)
      REFERENCES scheme (id) 
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_collmis_subscheme FOREIGN KEY (subscheme)
      REFERENCES sub_scheme (id) 
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE SEQUENCE seq_egcl_collectionmis;

CREATE INDEX indx_collmis_collheader
  ON egcl_collectionmis
  USING btree
  (collectionheader);

CREATE INDEX indx_collmis_dept
  ON egcl_collectionmis
  USING btree
  (department);


CREATE INDEX indx_collmis_deptid
  ON egcl_collectionmis
  USING btree
  (department);
