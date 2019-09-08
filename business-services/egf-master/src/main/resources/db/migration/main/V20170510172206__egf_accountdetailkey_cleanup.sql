ALTER TABLE egf_accountdetailkey DROP CONSTRAINT pk_egf_accountdetailkey cascade;
ALTER TABLE egf_accountdetailkey ADD primary key (id, tenantid); 
ALTER TABLE egf_accountdetailkey alter column key type bigint;
ALTER TABLE egf_accountdetailkey drop column groupid;
ALTER TABLE egf_accountdetailkey drop column name;
