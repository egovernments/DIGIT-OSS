DO $$ 
BEGIN
BEGIN
ALTER TABLE state.eg_tenant ADD COLUMN url character varying(256);
EXCEPTION
WHEN duplicate_column THEN RAISE NOTICE 'column url already exists in state.eg_tenant.';
END;

update state.eg_tenant set url='https://obps-dev.egovernments.org';
alter table state.eg_tenant alter column url set NOT NULL;
END;
$$