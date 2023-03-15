ALTER TABLE eg_vendor ADD COLUMN IF NOT EXISTS agencyType VARCHAR(64) NOT NULL DEFAULT 'ULB';
UPDATE eg_vendor SET agencyType = 'ULB' WHERE agencyType IS NULL;
ALTER TABLE eg_vendor ADD COLUMN IF NOT EXISTS paymentPreference VARCHAR(64) NOT NULL DEFAULT 'ULB';
UPDATE eg_vendor SET paymentPreference = 'pre-service' WHERE paymentPreference IS NULL;