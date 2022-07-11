ALTER TABLE eg_land_ownerInfo
ADD COLUMN IF NOT EXISTS status boolean DEFAULT TRUE;
