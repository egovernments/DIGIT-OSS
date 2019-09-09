
Create table egf_instrumentvoucher( 
  	id varchar(50),
  	voucherHeaderId varchar(50),
    InstrumentId varchar(50),
		createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrumentvoucher add constraint pk_egf_instrumentvoucher primary key (id);
create sequence seq_egf_instrumentvoucher;
