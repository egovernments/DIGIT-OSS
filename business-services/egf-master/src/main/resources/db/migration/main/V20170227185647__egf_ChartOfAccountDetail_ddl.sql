
Create table egf_chartofaccountdetail( 
	id bigint,
	glcodeid bigint  NOT NULL,
	detailtypeid bigint  NOT NULL,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_chartofaccountdetail add constraint pk_egf_chartofaccountdetail primary key (id);
alter table egf_chartofaccountdetail add constraint fk_egf_chartofaccountdetail_glcodeid  FOREIGN KEY (glcodeid) REFERENCES egf_chartofaccount(id);
alter table egf_chartofaccountdetail add constraint fk_egf_chartofaccountdetail_detailtypeid  FOREIGN KEY (detailtypeid) REFERENCES egf_accountdetailtype(id);
create sequence seq_egf_chartofaccountdetail;
