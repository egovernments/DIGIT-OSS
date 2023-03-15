ALTER TABLE eg_fsm_application ADD COLUMN IF NOT EXISTS paymentpreference VARCHAR(64) NOT NULL DEFAULT 'PRE_PAY';
UPDATE eg_fsm_application SET paymentPreference = 'PRE_PAY',lastmodifiedby='SAN-843',lastmodifiedtime=extract(epoch from current_timestamp )*1000
WHERE paymentPreference IS NULL;

ALTER TABLE eg_fsm_application_auditlog ADD COLUMN IF NOT EXISTS paymentpreference VARCHAR(64) NOT NULL DEFAULT 'PRE_PAY';
UPDATE eg_fsm_application_auditlog SET paymentPreference = 'PRE_PAY',lastmodifiedby='SAN-843',lastmodifiedtime=extract(epoch from current_timestamp )*1000 
WHERE paymentPreference IS NULL;
