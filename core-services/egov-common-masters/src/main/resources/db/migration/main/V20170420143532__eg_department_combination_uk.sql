--------------------------------UPDATE UNIQUE KEY CONSTRAINT----------------------------

--EG_DEPARTMENT

ALTER TABLE eg_department DROP CONSTRAINT uk_eg_department_code;
ALTER TABLE eg_department ADD CONSTRAINT uk_eg_department_code UNIQUE (code,tenantid);

ALTER TABLE eg_department DROP CONSTRAINT uk_eg_department_name;
ALTER TABLE eg_department ADD CONSTRAINT uk_eg_department_name UNIQUE (name,tenantid);