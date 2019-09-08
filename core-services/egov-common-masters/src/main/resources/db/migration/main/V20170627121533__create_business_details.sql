CREATE TABLE eg_businessdetails
(
  id bigint NOT NULL,
  name character varying(100) NOT NULL,
  businessurl character varying(256),
  isenabled boolean,
  code character varying(12) NOT NULL,
  businesstype character(1),
  fund character varying(50),
  function character varying(50),
  fundsource character varying(50),
  functionary character varying(50),
  department character varying (100),
  vouchercreation boolean,
  businesscategory bigint,
  isvoucherapproved boolean,
  vouchercutoffdate timestamp without time zone,
  createddate timestamp ,
  lastmodifieddate timestamp ,
  createdby bigint,
  lastmodifiedby bigint,
  ordernumber integer,
  version bigint DEFAULT 0,
  tenantId character varying(256) NOT NULL,
  CONSTRAINT pk_eg_businessdetails PRIMARY KEY (id),
  CONSTRAINT fk_serdtls_servicecat FOREIGN KEY (businesscategory)
  REFERENCES eg_businesscategory (id),
  CONSTRAINT uk_eg_businessdetails_idtenant UNIQUE (name,tenantid),
  CONSTRAINT uk_eg_businessdetails_codetenant UNIQUE (code,tenantid)
 );
 
 create SEQUENCE SEQ_EG_BUSINESSDETAILS
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 

    
 CREATE TABLE eg_business_accountdetails
 (
 id bigint NOT NULL,
 businessdetails bigint NOT NULL,
 chartofaccount bigint NOT NULL,
 amount double precision,
 tenantId character varying(256) NOT NULL,
  CONSTRAINT pk_eg_business_accountdetails PRIMARY KEY (id),
  CONSTRAINT fk_eg_srvcacc_srvdtils FOREIGN KEY (businessdetails)
  REFERENCES eg_businessdetails (id) 
);


 create SEQUENCE SEQ_EG_BUSINESS_ACCOUNTDETAILS
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 

  
  
CREATE TABLE eg_business_subledgerinfo
(
id bigint NOT NULL,
accountdetailtype bigint NOT NULL,
  accountdetailkey bigint,
  amount double precision,
  businessaccountdetail bigint NOT NULL,
  tenantId character varying(256) NOT NULL,
  CONSTRAINT pk_eg_business_subledgerinfo PRIMARY KEY (id),
  CONSTRAINT fk_eg_subledgerdetails_srvcacc FOREIGN KEY (businessaccountdetail)
  REFERENCES eg_business_accountdetails (id) 
);

 Create SEQUENCE SEQ_EG_BUSINESS_SUBLEDGERINFO
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;