CREATE TABLE eg_user (
    id bigint NOT NULL,
    title character varying(8),
    salutation character varying(5),
    dob timestamp,
    locale character varying(16),
    username character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    pwdexpirydate timestamp DEFAULT CURRENT_TIMESTAMP,
    mobilenumber character varying(50),
    altcontactnumber character varying(50),
    emailid character varying(128),
    createddate timestamp,
    lastmodifieddate timestamp,
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
    signature character varying(36),
    accountlocked boolean DEFAULT false,
    bloodgroup character varying(32),
    photo character varying(36),
    identificationmark character varying(300),
    tenantid character varying(256) not null
);

CREATE SEQUENCE seq_eg_user
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE eg_user ADD CONSTRAINT eg_user_pkey PRIMARY KEY (id);
ALTER TABLE eg_user ADD CONSTRAINT eg_user_user_name_key UNIQUE (username);