--create audit table for financial year 
CREATE TABLE financialyear_aud
(
  id bigint NOT NULL,
  rev integer NOT NULL,
  financialyear character varying(50),
  startingdate timestamp without time zone,
  endingdate timestamp without time zone,
  isactive boolean,
  isactiveforposting boolean ,
  isclosed boolean,
  transferclosingbalance boolean,
  lastmodifiedby bigint,
  lastmodifieddate timestamp without time zone,
  revtype numeric
);
ALTER TABLE ONLY financialyear_aud ADD CONSTRAINT financialyear_aud_pkey PRIMARY KEY (id, rev);