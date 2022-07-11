ALTER TABLE eg_land_owner_auditdetails
ADD COLUMN IF NOT EXISTS status boolean DEFAULT TRUE;
