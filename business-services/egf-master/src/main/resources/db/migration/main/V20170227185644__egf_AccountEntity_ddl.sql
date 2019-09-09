
Create table egf_accountentitymaster( 
	id bigint,
	detailtypeid bigint  NOT NULL,
	code varchar(25) NOT NULL,
	name varchar(350) NOT NULL,
	active boolean NOT NULL,
	description varchar(256),
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_accountentitymaster add constraint pk_egf_accountentitymaster primary key (id);
alter table egf_accountentitymaster add constraint fk_egf_accountentitymaster_detailtypeid  FOREIGN KEY (detailtypeid) REFERENCES egf_accountdetailtype(id);
create sequence seq_egf_accountentitymaster;
