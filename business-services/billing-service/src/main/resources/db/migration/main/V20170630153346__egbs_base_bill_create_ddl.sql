CREATE SEQUENCE seq_egbs_bill;
CREATE TABLE egbs_bill
(
 id character varying(64) NOT NULL,

 tenantid character varying(250) NOT NULL,

 payeename character varying(256) NOT NULL,

 payeeaddress character varying(1024),

 payeeemail character varying(256),

 isactive boolean,

 iscancelled boolean,

 createdby character varying(64) NOT NULL,

 createddate bigint NOT NULL,

 lastmodifiedby character varying(64),

 lastmodifieddate bigint,

 CONSTRAINT pk_eg_bs_bill PRIMARY KEY (id, tenantid)
);


CREATE SEQUENCE seq_egbs_billdetail;
CREATE SEQUENCE seq_egbs_billnumber;
CREATE TABLE egbs_billdetail
(

 id character varying(64) NOT NULL,

 tenantid character varying(250) NOT NULL,

 billid character varying(64) NOT NULL,

 businessservice character varying(250) NOT NULL,

 billno character varying(32) NOT NULL,

 billdate bigint NOT NULL,

 consumercode character varying(250) NOT NULL,

 consumertype character varying(250),

 billdescription character varying(1024),

 displaymessage character varying(1024),

 minimumamount numeric(12,2),

 totalamount numeric(12,2),

 callbackforapportioning boolean,

 partpaymentallowed boolean,

 collectionmodesnotallowed character varying(512),

 createdby character varying(64) NOT NULL,

 createddate bigint NOT NULL,

 lastmodifiedby character varying(64),

 lastmodifieddate bigint,

 CONSTRAINT pk_eg_bs_billdetail PRIMARY KEY (id, tenantid),

 CONSTRAINT fk_eg_bs_bill FOREIGN KEY (billid, tenantid)

     REFERENCES egbs_bill (id, tenantid) MATCH SIMPLE

     ON UPDATE NO ACTION ON DELETE NO ACTION
);


CREATE SEQUENCE seq_egbs_billaccountdetail;
CREATE TABLE egbs_billaccountdetail
(

 id character varying(64) NOT NULL,

 tenantid character varying(250) NOT NULL,

 billdetail character varying(64) NOT NULL,

 glcode character varying(250) NOT NULL,

 orderno integer,

 accountdescription character varying(512) NOT NULL,

 creditamount numeric(12,2),

 debitamount numeric(12,2),

 isactualdemand boolean,

 purpose character varying(250),

 createdby character varying(64) NOT NULL,

 createddate bigint NOT NULL,

 lastmodifiedby character varying(64),

 lastmodifieddate bigint,

 CONSTRAINT pk_eg_bs_billaccountdetails PRIMARY KEY (id, tenantid),

 CONSTRAINT fk_eg_bs_billdetail FOREIGN KEY (billdetail, tenantid)

     REFERENCES egbs_billdetail (id, tenantid) MATCH SIMPLE

     ON UPDATE NO ACTION ON DELETE NO ACTION
);
