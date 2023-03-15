
Create table egf_accountdetailtype( 
	id bigint,
	name varchar(50) NOT NULL,
	description varchar(50) NOT NULL,
	tableName varchar(25),
	columnName varchar(25),
	attributeName varchar(50),
	active boolean NOT NULL,
	FULLY_QUALIFIED_NAME varchar(250),
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_accountdetailtype add constraint pk_egf_accountdetailtype primary key (id);
create sequence seq_egf_accountdetailtype;
