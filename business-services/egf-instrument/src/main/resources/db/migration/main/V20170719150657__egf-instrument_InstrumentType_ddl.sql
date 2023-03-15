
Create table egf_instrumenttype
( 
  id varchar(50),
  name varchar(50) NOT NULL,
  description varchar(100),
  active boolean NOT NULL,
    	createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrumenttype add constraint pk_egf_instrumenttype primary key (id);
create sequence seq_egf_instrumenttype;
