
Create table egf_subscheme( 
	id bigint,
	 scheme bigint NOT NULL,
	code varchar(50) NOT NULL,
	name varchar(50) NOT NULL,
	validFrom date NOT NULL,
	validTo date NOT NULL,
	active boolean NOT NULL,
	departmentId bigint,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_subscheme add constraint pk_egf_subscheme primary key (id);
create sequence seq_egf_subscheme;
