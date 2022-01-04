
Create table egf_bankbranch( 
	id bigint,
	bankid bigint  NOT NULL,
	code varchar(50) NOT NULL,
	name varchar(50) NOT NULL,
	address varchar(50) NOT NULL,
	address2 varchar(50),
	city varchar(50),
	state varchar(50),
	pincode varchar(50),
	phone varchar(15),
	fax varchar(15),
	contactPerson varchar(50),
	active boolean NOT NULL,
	description varchar(256),
	micr varchar(50),
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_bankbranch add constraint pk_egf_bankbranch primary key (id);
alter table egf_bankbranch add constraint fk_egf_bankbranch_bankid  FOREIGN KEY (bankid) REFERENCES egf_bank(id);
create sequence seq_egf_bankbranch;
