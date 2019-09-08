
Create table egf_fundsource( 
	id bigint,
	code varchar(25) NOT NULL,
	name varchar(25) NOT NULL,
	type varchar(25),
	parentid bigint ,
	llevel numeric (13,2),
	active boolean NOT NULL,
	isParent boolean,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_fundsource add constraint pk_egf_fundsource primary key (id);
alter table egf_fundsource add constraint fk_egf_fundsource_parentid  FOREIGN KEY (parentid) REFERENCES egf_fundsource(id);
create sequence seq_egf_fundsource;
