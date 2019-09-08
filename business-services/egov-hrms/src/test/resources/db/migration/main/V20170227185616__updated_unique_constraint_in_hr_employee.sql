TRUNCATE TABLE egeis_employee CASCADE;
TRUNCATE TABLE egeis_assignment CASCADE;

-- EMPLOYEE TABLE CONSTRAINTS
ALTER TABLE egeis_employee ADD CONSTRAINT uk_egeis_employee_passportNo UNIQUE (passportNo);
ALTER TABLE egeis_employee ADD CONSTRAINT uk_egeis_employee_gpfNo UNIQUE (gpfNo);
ALTER TABLE egeis_employee ADD CONSTRAINT uk_egeis_employee_bankAccount UNIQUE (bankAccount);
