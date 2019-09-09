
Create table egf_financialyear( 
	id bigint,
	FinancialYear varchar(25),
	startingDate date NOT NULL,
	endingDate date NOT NULL,
	active boolean NOT NULL,
	isActiveForPosting boolean NOT NULL,
	isClosed boolean,
	transferClosingBalance boolean,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_financialyear add constraint pk_egf_financialyear primary key (id);
create sequence seq_egf_financialyear;
