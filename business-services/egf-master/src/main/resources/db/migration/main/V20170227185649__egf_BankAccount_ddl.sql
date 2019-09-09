
Create table egf_bankaccount( 
	id bigint,
	branchid bigint ,
	glcodeid bigint ,
	fundid bigint ,
	accountNumber varchar(25) NOT NULL,
	accountType varchar(20),
	description varchar(256),
	active boolean NOT NULL,
	payTo varchar(100),
	type varchar(17) NOT NULL,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_bankaccount add constraint pk_egf_bankaccount primary key (id);
alter table egf_bankaccount add constraint fk_egf_bankaccount_branchid  FOREIGN KEY (branchid) REFERENCES egf_bankbranch(id);
alter table egf_bankaccount add constraint fk_egf_bankaccount_glcodeid  FOREIGN KEY (glcodeid) REFERENCES egf_chartofaccount(id);
alter table egf_bankaccount add constraint fk_egf_bankaccount_fundid  FOREIGN KEY (fundid) REFERENCES egf_fund(id);
create sequence seq_egf_bankaccount;
