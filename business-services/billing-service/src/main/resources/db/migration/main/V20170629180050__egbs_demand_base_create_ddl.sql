
CREATE SEQUENCE seq_egbs_demand;

CREATE SEQUENCE seq_egbs_demanddetail;

CREATE TABLE egbs_demand
(

id character varying(64) NOT NULL,

consumerCode character varying(250) NOT NULL,

consumerType character varying(250) NOT NULL,

businessservice character varying(250) NOT NULL,

owner character varying(250) NOT NULL,

taxPeriodFrom bigint NOT NULL,

taxPeriodTo bigint NOT NULL,

minimumAmountPayable numeric(12,0),

createdby character varying(16) NOT NULL,

createdtime bigint NOT NULL,

lastModifiedby character varying(16),

lastModifiedtime bigint,

tenantid character varying(250) NOT NULL,

CONSTRAINT pk_egbs_demand PRIMARY KEY (id,tenantid)
);


CREATE TABLE egbs_demanddetail
(

 id character varying(64) NOT NULL,

 demandid character varying(64) NOT NULL,

 taxHeadCode character varying(250) NOT NULL,

 taxamount numeric(12,2) NOT NULL,

 collectionamount numeric(12,2) NOT NULL,

 createdby character varying(64) NOT NULL,

 createdtime bigint NOT NULL,

 lastModifiedby character varying(64),

 lastModifiedtime bigint,

 tenantid character varying(250) NOT NULL, 

CONSTRAINT pk_egbs_demanddetail PRIMARY KEY (id,tenantid),

CONSTRAINT fk_egbs_demanddetail FOREIGN KEY (demandid,tenantid) REFERENCES egbs_demand(id,tenantid)
);
