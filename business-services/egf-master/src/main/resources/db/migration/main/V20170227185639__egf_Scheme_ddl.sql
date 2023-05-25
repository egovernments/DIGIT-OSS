
Create table egf_scheme( 
	id bigint,
	fundId bigint ,
	code varchar(25),
	name varchar(25),
	validFrom date NOT NULL,
	validTo date NOT NULL,
	active boolean NOT NULL,
	description varchar(256),
	boundary bigint,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_scheme add constraint pk_egf_scheme primary key (id);
alter table egf_scheme add constraint fk_egf_scheme_fundId  FOREIGN KEY (fundId) REFERENCES egf_fund(id);
create sequence seq_egf_scheme;
