ALTER TABLE eg_vendor_auditlog ADD COLUMN IF NOT EXISTS agencyType VARCHAR(64) NOT NULL DEFAULT 'ULB';
UPDATE eg_vendor_auditlog SET agencyType = 'ULB' WHERE agencyType IS NULL;

ALTER TABLE eg_vendor_auditlog ADD COLUMN IF NOT EXISTS paymentPreference VARCHAR(64) NOT NULL DEFAULT 'pre-service';
UPDATE eg_vendor_auditlog SET paymentPreference = 'pre-service' WHERE paymentPreference IS NULL;