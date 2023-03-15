update eg_role set tenantid = 'default' where tenantid = 'ap.public' and code not in('CITIZEN','EMPLOYEE','SUPERUSER','EMPLOYEE ADMIN');

delete from eg_address where id = 1;
UPDATE eg_user set mobilenumber='1234567890' where mobilenumber is null;

ALTER TABLE eg_user ALTER COLUMN mobilenumber SET NOT NULL;

