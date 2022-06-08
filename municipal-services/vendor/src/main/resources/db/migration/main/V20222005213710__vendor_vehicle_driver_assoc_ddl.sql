ALTER TABLE eg_vendor_driver ADD COLUMN IF NOT EXISTS vendorDriverStatus VARCHAR(64);
UPDATE eg_vendor_driver SET vendorDriverStatus = 'ACTIVE' WHERE vendorDriverStatus IS NULL;

ALTER TABLE eg_vendor_vehicle ADD COLUMN IF NOT EXISTS vendorVehicleStatus VARCHAR(64);
UPDATE eg_vendor_vehicle SET vendorVehicleStatus = 'ACTIVE' WHERE vendorVehicleStatus IS NULL;