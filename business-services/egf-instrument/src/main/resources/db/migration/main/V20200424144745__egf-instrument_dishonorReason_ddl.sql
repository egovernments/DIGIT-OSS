
Create table egf_instrumentdishonor( 
  	id varchar(50),
  	reason varchar(100),
    remarks varchar(250),
    instrumentid varchar(50),
    reversalVoucherId varchar(50),
    dishonorDate bigint NOT NULL,
		createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrumentdishonor add constraint pk_egf_instrumentdishonor primary key (id);
create sequence seq_egf_instrumentdishonor;
