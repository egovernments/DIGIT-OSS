CREATE TABLE IF NOT EXISTS state.eg_address
(
  housenobldgapt character varying(32),
  subdistrict character varying(100),
  postoffice character varying(100),
  landmark character varying(256),
  country character varying(50),
  userid bigint,
  type character varying(50),
  streetroadline character varying(256),
  citytownvillage character varying(256),
  arealocalitysector character varying(256),
  district character varying(100),
  state character varying(100),
  pincode character varying(10),
  id numeric NOT NULL,
  version bigint DEFAULT 0,
  CONSTRAINT eg_address_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user_eg_address FOREIGN KEY (userid)
      REFERENCES state.eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS state.eg_correspondence_address
(
  id numeric,
  version numeric DEFAULT 0
);

CREATE TABLE IF NOT EXISTS state.eg_permanent_address
(
  id numeric,
  version numeric DEFAULT 0
);

CREATE SEQUENCE IF NOT EXISTS state.seq_eg_address
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;