
Create table egf_instrumentaccountcode
( 
  id varchar(50),
  instrumentTypeId varchar(50),
  accountCodeId varchar(50),
  createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrumentaccountcode add constraint pk_egf_instrumentaccountcode primary key (id);
create sequence seq_egf_instrumentaccountcode;
