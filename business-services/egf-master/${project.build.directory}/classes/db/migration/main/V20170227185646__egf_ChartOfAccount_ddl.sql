
Create table egf_chartofaccount( 
	id bigint,
	glcode varchar(16) NOT NULL,
	name varchar(128) NOT NULL,
	purposeId bigint ,
	desciption varchar(256),
	isActiveForPosting boolean NOT NULL,
	parentId bigint,
	type varchar(1) NOT NULL,
	classification bigint NOT NULL,
	functionRequired boolean NOT NULL,
	budgetCheckRequired boolean NOT NULL,
	majorCode varchar(16),
	isSubLedger boolean,
		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint
);
alter table egf_chartofaccount add constraint pk_egf_chartofaccount primary key (id);
alter table egf_chartofaccount add constraint fk_egf_chartofaccount_purposeId  FOREIGN KEY (purposeId) REFERENCES egf_accountcodepurpose(id);
create sequence seq_egf_chartofaccount;
