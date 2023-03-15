ALTER TABLE egeis_employeeJurisdictions ADD CONSTRAINT fk_egeis_employeeJurisdictions_employeeId
    FOREIGN KEY (employeeId) REFERENCES egeis_employee (id);

ALTER TABLE egeis_employeeLanguages ADD CONSTRAINT fk_egeis_employeeLanguages_employeeId 
    FOREIGN KEY (employeeId) REFERENCES egeis_employee (id);

ALTER TABLE egeis_hodDepartment RENAME CONSTRAINT egeis_hodDepartment_assignmentId
    TO fk_egeis_hodDepartment_assignmentId;