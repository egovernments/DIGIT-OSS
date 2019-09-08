
Create table egf_instrumenttypeproperty( 
id varchar(50) not null,
  transactionType varchar(6) NOT NULL,
  reconciledOncreate boolean NOT NULL,
  statusOnCreateId varchar(50) NOT NULL,
  statusOnUpdateId varchar(50) NOT NULL,
  statusOnReconcileId varchar(50) NOT NULL,
  InstrumentTypeId varchar(50),
		createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrumenttypeproperty add constraint pk_egf_instrumenttypeproperty primary key (id);
create sequence seq_egf_instrumenttypeproperty;
