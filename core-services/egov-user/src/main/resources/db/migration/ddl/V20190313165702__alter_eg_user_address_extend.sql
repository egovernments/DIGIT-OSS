ALTER TABLE eg_user 
  ALTER COLUMN name TYPE varchar (250),
  ALTER COLUMN mobilenumber TYPE varchar (150),
  ALTER COLUMN emailid TYPE varchar (300),
  ALTER COLUMN username TYPE varchar (180),
  ALTER COLUMN altcontactnumber TYPE varchar (150),
  ALTER COLUMN pan TYPE varchar (65),
  ALTER COLUMN aadhaarnumber TYPE varchar (85),
  ALTER COLUMN guardian TYPE varchar (250);

ALTER TABLE eg_user_address
  ALTER COLUMN address TYPE varchar (440);