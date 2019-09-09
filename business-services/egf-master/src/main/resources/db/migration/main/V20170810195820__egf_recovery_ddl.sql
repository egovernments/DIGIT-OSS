
Create table egf_recovery(
	id VARCHAR(256),
	chartofaccountid varchar(256) NOT NULL,
	type varchar(20),
	flat double precision,
	active boolean NOT NULL,
	remitted varchar(100) not null,
	name VARCHAR(50) not null,
	code VARCHAR(50) not null,
	ifsccode VARCHAR(16),
	mode VARCHAR(1),
	remittancemode VARCHAR(1),
	accountnumber VARCHAR(32),
	percentage double precision,
	createdby bigint,
  createddate timestamp without time zone,
  lastmodifiedby bigint,
  lastmodifieddate timestamp without time zone,
  version bigint default 0,
  tenantid VARCHAR(256) not null
);
alter table egf_recovery add constraint pk_egf_recovery primary key (id,tenantid);
create sequence seq_egf_recovery;
