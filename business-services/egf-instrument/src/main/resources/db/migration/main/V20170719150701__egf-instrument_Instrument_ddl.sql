
Create table egf_instrument( 
  id varchar(50),
  transactionNumber varchar(50) Not null,
  transactionDate date NOT NULL,
  amount numeric (13,2) NOT NULL,
  instrumentTypeId varchar(50) NOT NULL,
  bankId varchar(50),
  branchName varchar(50),
  bankAccountId varchar(50),
  financialStatusId varchar(50),
  transactionType varchar(6),
  payee varchar(50),
  drawer varchar(100),
  surrendarReasonId varchar(50),
  serialNo varchar(50),
    	createdby varchar(50),
		createddate timestamp without time zone,
		lastmodifiedby varchar(50),
		lastmodifieddate timestamp without time zone,
		tenantId varchar(250),
		version bigint
);
alter table egf_instrument add constraint pk_egf_instrument primary key (id);
create sequence seq_egf_instrument;
