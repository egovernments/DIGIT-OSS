ALTER TABLE egf_budgetdetail DROP CONSTRAINT fk_budgetdetail_using_dept;
ALTER TABLE egf_budgetdetail ALTER COLUMN using_department TYPE varchar(20);