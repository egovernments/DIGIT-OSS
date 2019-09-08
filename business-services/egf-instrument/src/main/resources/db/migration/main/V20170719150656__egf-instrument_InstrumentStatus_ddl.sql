
Create table egf_instrumentstatus
( 
  id varchar(50) NOT NULL,
  moduleType varchar(50) NOT NULL,
  name varchar(20) NOT NULL,
  description varchar(250) NOT NULL,
    	createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrumentstatus add constraint pk_egf_instrumentstatus primary key (id);
create sequence seq_egf_instrumentstatus;
