
Create table egf_bank( 
	id bigint,
	code varchar(50) NOT NULL,
	name varchar(100) NOT NULL,
	description varchar(250),
	active boolean NOT NULL,
	type varchar(50) NOT NULL,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_bank add constraint pk_egf_bank primary key (id);
create sequence seq_egf_bank;
