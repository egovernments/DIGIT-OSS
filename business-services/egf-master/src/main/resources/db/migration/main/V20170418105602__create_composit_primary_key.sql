ALTER TABLE egf_accountcodepurpose DROP CONSTRAINT pk_egf_accountcodepurpose cascade;
ALTER TABLE egf_accountdetailtype   DROP CONSTRAINT pk_egf_accountdetailtype cascade;
ALTER TABLE egf_bankaccount DROP CONSTRAINT pk_egf_bankaccount cascade;
ALTER TABLE egf_bankbranch DROP CONSTRAINT pk_egf_bankbranch cascade;
ALTER TABLE egf_bank DROP CONSTRAINT pk_egf_bank cascade;
ALTER TABLE egf_chartofaccount DROP CONSTRAINT pk_egf_chartofaccount cascade;
ALTER TABLE egf_chartofaccountdetail   DROP CONSTRAINT pk_egf_chartofaccountdetail cascade;
ALTER TABLE egf_functionary DROP CONSTRAINT pk_egf_functionary cascade;
ALTER TABLE egf_function  DROP CONSTRAINT pk_egf_function cascade;
ALTER TABLE egf_fund DROP CONSTRAINT pk_egf_fund cascade;

ALTER TABLE egf_accountcodepurpose ADD primary key (id, tenantid); 
ALTER TABLE egf_accountdetailtype ADD primary key (id, tenantid); 
ALTER TABLE egf_bankaccount ADD primary key (id, tenantid); 
ALTER TABLE egf_bankbranch ADD primary key (id, tenantid); 
ALTER TABLE egf_bank ADD primary key (id, tenantid); 
ALTER TABLE egf_chartofaccount ADD primary key (id, tenantid); 
ALTER TABLE egf_chartofaccountdetail ADD primary key (id, tenantid); 
ALTER TABLE egf_functionary ADD primary key (id, tenantid); 
ALTER TABLE egf_function ADD primary key (id, tenantid); 
ALTER TABLE egf_fund ADD primary key (id, tenantid); 

