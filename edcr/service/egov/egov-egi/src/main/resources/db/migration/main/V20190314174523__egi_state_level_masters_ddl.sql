CREATE TABLE IF NOT EXISTS state.eg_user
(
  id bigint NOT NULL,
  tenantId character varying(250),
  title character varying(8),
  salutation character varying(5),
  dob timestamp without time zone,
  locale character varying(16),
  username character varying(64) NOT NULL,
  password character varying(64) NOT NULL,
  pwdexpirydate timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
  mobilenumber character varying(50),
  altcontactnumber character varying(50),
  emailid character varying(128),
  createddate timestamp without time zone,
  lastmodifieddate timestamp without time zone,
  createdby bigint,
  lastmodifiedby bigint,
  active boolean,
  name character varying(100),
  gender smallint,
  pan character varying(10),
  aadhaarnumber character varying(20),
  type character varying(50),
  version numeric DEFAULT 0,
  guardian character varying(100),
  guardianrelation character varying(32),
  signature bytea,
  accountlocked boolean DEFAULT false,
  CONSTRAINT eg_user_pkey PRIMARY KEY (id),
  CONSTRAINT eg_user_user_name_key UNIQUE (username,tenantId)
);

CREATE TABLE IF NOT EXISTS state.eg_user_aud
(
  id integer NOT NULL,
  tenantId character varying(250),
  rev integer NOT NULL,
  name character varying(100),
  mobilenumber character varying(50),
  emailid character varying(128),
  revtype numeric,
  password character varying(64),
  CONSTRAINT pk_eg_user_aud PRIMARY KEY (id, rev)
);

CREATE TABLE IF NOT EXISTS state.eg_userrole
(
  roleid bigint NOT NULL,
  userid bigint NOT NULL,
  CONSTRAINT fk_user_userrole FOREIGN KEY (userid)
      REFERENCES state.eg_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);


CREATE TABLE IF NOT EXISTS state.eg_userrole_aud
(
  userid numeric,
  roleid numeric,
  rev integer,
  revtype numeric
);

CREATE SEQUENCE IF NOT EXISTS state.seq_eg_user
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 4
  CACHE 1;
