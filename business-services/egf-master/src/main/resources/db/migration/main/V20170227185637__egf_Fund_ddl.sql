
Create table egf_fund( 
	id bigint,
	name varchar(50) NOT NULL,
	code varchar(50) NOT NULL,
	identifier varchar(1) NOT NULL,
	level bigint NOT NULL,
	parentid bigint ,
	isParent boolean,
	active boolean NOT NULL,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_fund add constraint pk_egf_fund primary key (id);
alter table egf_fund add constraint fk_egf_fund_parentid  FOREIGN KEY (parentid) REFERENCES egf_fund(id);
create sequence seq_egf_fund;
