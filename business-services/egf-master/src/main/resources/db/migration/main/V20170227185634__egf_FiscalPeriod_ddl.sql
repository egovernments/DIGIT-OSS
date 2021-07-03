
Create table egf_fiscalperiod( 
	id bigint,
	name varchar(25) NOT NULL,
	FinancialYearid bigint  NOT NULL,
	startingDate date NOT NULL,
	endingDate date NOT NULL,
	active boolean NOT NULL,
	isActiveForPosting boolean NOT NULL,
	isClosed boolean,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_fiscalperiod add constraint pk_egf_fiscalperiod primary key (id);
alter table egf_fiscalperiod add constraint fk_egf_fiscalperiod_FinancialYearid  FOREIGN KEY (FinancialYearid) REFERENCES egf_financialyear(id);
create sequence seq_egf_fiscalperiod;
