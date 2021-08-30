
Create table egf_functionary( 
	id bigint,
	code varchar(16) NOT NULL,
	name varchar(256) NOT NULL,
	active boolean NOT NULL,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_functionary add constraint pk_egf_functionary primary key (id);
create sequence seq_egf_functionary;
