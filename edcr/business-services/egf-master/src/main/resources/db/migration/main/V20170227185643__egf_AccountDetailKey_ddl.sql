
Create table egf_accountdetailkey( 
	id bigint,
	groupId smallint,
	name varchar(128),
	key smallint,
	detailTypeId bigint  NOT NULL,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_accountdetailkey add constraint pk_egf_accountdetailkey primary key (id);
alter table egf_accountdetailkey add constraint fk_egf_accountdetailkey_detailTypeId  FOREIGN KEY (detailTypeId) REFERENCES egf_accountdetailtype(id);
create sequence seq_egf_accountdetailkey;
