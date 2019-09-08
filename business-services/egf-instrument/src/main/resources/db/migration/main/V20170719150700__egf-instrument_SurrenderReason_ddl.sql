
Create table egf_surrenderreason( 
  id varchar(50),
  name varchar(50),
  description varchar(250),
    	createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_surrenderreason add constraint pk_egf_surrenderreason primary key (id);
create sequence seq_egf_surrenderreason;
