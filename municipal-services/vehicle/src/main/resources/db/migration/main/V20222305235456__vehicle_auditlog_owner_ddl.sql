ALTER TABLE eg_vehicle_auditlog ADD COLUMN IF NOT EXISTS vehicleowner VARCHAR(64) NOT NULL DEFAULT 'ULB';

UPDATE eg_vehicle_auditlog SET vehicleowner = 'ULB' WHERE vehicleowner IS NULL;