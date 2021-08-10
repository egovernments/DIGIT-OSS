ALTER TABLE egf_budgetdetail DROP CONSTRAINT fk_budgetdetail_exe_dept;
ALTER TABLE egf_budgetdetail ALTER COLUMN executing_department TYPE varchar(20);