ALTER TABLE egf_accountdetailtype DROP COLUMN columnname RESTRICT;
ALTER TABLE egf_accountdetailtype DROP COLUMN attributename RESTRICT;
ALTER TABLE egf_bankaccount ALTER COLUMN accounttype TYPE varchar(150);

--rollback ALTER TABLE egf_accountdetailtype add COLUMN columnname varchar(50);
--rollback ALTER TABLE egf_accountdetailtype add COLUMN attributename varchar(50);
--rollback ALTER TABLE egf_bankaccount ALTER COLUMN accounttype TYPE varchar(20);