ALTER TABLE eg_vehicle ADD COLUMN IF NOT EXISTS vehicleowner VARCHAR(64) NOT NULL DEFAULT 'ULB';

UPDATE eg_vehicle SET vehicleowner = 'ULB' WHERE vehicleowner IS NULL;