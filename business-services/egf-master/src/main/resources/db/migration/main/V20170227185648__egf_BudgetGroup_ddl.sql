
Create table EGF_BUDGETGROUP( 
	id bigint,
	name varchar(250),
	description varchar(250),
	majorcode bigint ,
	hgfdsa bigint ,
	mincode bigint ,
	accountType varchar(19),
	budgetingType varchar(6),
	active boolean,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table EGF_BUDGETGROUP add constraint pk_EGF_BUDGETGROUP primary key (id);
alter table EGF_BUDGETGROUP add constraint fk_EGF_BUDGETGROUP_majorcode  FOREIGN KEY (majorcode) REFERENCES egf_chartofaccount(id);
alter table EGF_BUDGETGROUP add constraint fk_EGF_BUDGETGROUP_hgfdsa  FOREIGN KEY (hgfdsa) REFERENCES egf_chartofaccount(id);
alter table EGF_BUDGETGROUP add constraint fk_EGF_BUDGETGROUP_mincode  FOREIGN KEY (mincode) REFERENCES egf_chartofaccount(id);
create sequence seq_EGF_BUDGETGROUP;
