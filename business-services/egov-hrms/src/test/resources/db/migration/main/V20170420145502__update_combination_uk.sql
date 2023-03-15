-------------------------UPDATE UNIQUE KEY CONSTRAINT------------------------

--EGEIS_EMPLOYEE

ALTER TABLE egeis_employee DROP CONSTRAINT if exists uk_egeis_employee_code;
ALTER TABLE egeis_employee ADD CONSTRAINT uk_egeis_employee_code UNIQUE (code,tenantid);

ALTER TABLE egeis_employee DROP CONSTRAINT if exists uk_egeis_employee_passportNo;
ALTER TABLE egeis_employee ADD CONSTRAINT uk_egeis_employee_passportNo UNIQUE (passportNo,tenantid);

ALTER TABLE egeis_employee DROP CONSTRAINT if exists uk_egeis_employee_gpfNo;
ALTER TABLE egeis_employee ADD CONSTRAINT uk_egeis_employee_gpfNo UNIQUE (gpfNo,tenantid);