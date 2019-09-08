  drop table if exists egeis_egfStatus ;
  drop sequence if exists seq_egeis_egfStatus ;
 
  create table egf_financialstatus( 
  id varchar(50) NOT NULL,
  moduleType varchar(50) NOT NULL,
  code varchar(20) NOT NULL,
  name varchar(20) NOT NULL,
  description varchar(250) NOT NULL,
  		createdby bigint,
		createddate timestamp without time zone,
		lastmodifiedby bigint,
		lastmodifieddate timestamp without time zone,
		version bigint,
		tenantId varchar(250)
);
alter table egf_financialstatus add constraint pk_egf_financialstatus primary key (name,tenantId);
alter table egf_financialstatus add constraint unique_egf_financialstatus unique  (code,tenantId);