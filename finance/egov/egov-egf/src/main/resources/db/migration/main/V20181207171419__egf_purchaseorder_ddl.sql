CREATE TABLE egf_purchaseorder
(
  id bigint NOT NULL,
  code character varying(50) NOT NULL,
  name character varying(100) NOT NULL,
  orderNumber character varying(100) NOT NULL,
  orderDate timestamp without time zone NOT NULL,
  supplier bigint NOT NULL,
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
  CONSTRAINT pk_purchaseorder PRIMARY KEY (id),
  CONSTRAINT unq_purchaseorder UNIQUE (code),
  CONSTRAINT fk_purchaseorder_supplier FOREIGN KEY (supplier)
  	REFERENCES egf_supplier (id),
  CONSTRAINT fk_purchaseorder_fund FOREIGN KEY (fund)
    REFERENCES fund (id),
  CONSTRAINT fk_purchaseorder_scheme FOREIGN KEY (scheme)
    REFERENCES scheme (id),
  CONSTRAINT fk_purchaseorder_subscheme FOREIGN KEY (subScheme)
    REFERENCES sub_scheme (id)
);

CREATE SEQUENCE seq_egf_purchaseorder;
