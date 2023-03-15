ALTER TABLE eg_hrms_employee DROP CONSTRAINT uk_eghrms_employee_code;
ALTER TABLE eg_hrms_employee ADD CONSTRAINT uk_eghrms_employee_code UNIQUE (code, tenantid);