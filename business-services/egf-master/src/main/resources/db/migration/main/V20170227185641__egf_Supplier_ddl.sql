
Create table egf_supplier( 
	id bigint,
	code varchar(50) NOT NULL,
	name varchar(50) NOT NULL,
	address varchar(300),
	mobile varchar(10),
	email varchar(25),
	description varchar(250),
	active boolean NOT NULL,
	panNo varchar(10),
	tinNo varchar(20),
	registationNo varchar(25),
	bankAccount varchar(25),
	ifscCode varchar(12),
	bank bigint ,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_supplier add constraint pk_egf_supplier primary key (id);
alter table egf_supplier add constraint fk_egf_supplier_bank  FOREIGN KEY (bank) REFERENCES egf_bank(id);
create sequence seq_egf_supplier;
