
Create table edcredcrapplication( 
  applicationNumber varchar(50),
  dcrNumber varchar(50),
  applicationDate date,
    createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table edcredcrapplication add constraint pk_edcredcrapplication primary key (applicationNumber);
create sequence seq_edcredcrapplication;
