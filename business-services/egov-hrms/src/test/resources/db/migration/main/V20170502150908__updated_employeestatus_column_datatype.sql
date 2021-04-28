ALTER TABLE egeis_employee ALTER COLUMN employeeStatus TYPE BIGINT USING (employeeStatus::BIGINT);
