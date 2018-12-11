CREATE TABLE egf_workorder
(
  id bigint NOT NULL,
  name character varying(100) NOT NULL,
  orderNumber character varying(100) NOT NULL,
  orderDate timestamp without time zone NOT NULL,
  contractor bigint NOT NULL,
  orderValue numeric NOT NULL,
  advancePayable numeric,
  description character varying(250),
  fund bigint NOT NULL,
  department character varying(100),
  scheme bigint,
  subScheme bigint,
  sanctionNumber character varying(100),
  sanctionDate timestamp without time zone,
  active boolean NOT NULL,
  createdby bigint NOT NULL,
  lastmodifiedby bigint,
  createddate timestamp without time zone NOT NULL,
  lastmodifieddate timestamp without time zone,
  version bigint,
  CONSTRAINT pk_workorder PRIMARY KEY (id),
  CONSTRAINT unq_workorder UNIQUE (orderNumber),
  CONSTRAINT fk_workorder_contractor FOREIGN KEY (contractor)
  	REFERENCES egf_contractor (id),
  CONSTRAINT fk_workorder_fund FOREIGN KEY (fund)
    REFERENCES fund (id),
  CONSTRAINT fk_workorder_scheme FOREIGN KEY (scheme)
    REFERENCES scheme (id),
  CONSTRAINT fk_workorder_subscheme FOREIGN KEY (subScheme)
    REFERENCES sub_scheme (id)
);

CREATE SEQUENCE seq_egf_workorder;
