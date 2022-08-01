ALTER TABLE eg_birth_dtls_audit
ADD COLUMN IF NOT EXISTS islegacyrecord boolean;

ALTER TABLE eg_death_dtls_audit
ADD COLUMN IF NOT EXISTS islegacyrecord boolean;