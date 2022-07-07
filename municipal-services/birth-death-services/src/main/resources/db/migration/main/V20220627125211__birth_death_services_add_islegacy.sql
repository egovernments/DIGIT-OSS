ALTER TABLE eg_birth_dtls
ADD COLUMN IF NOT EXISTS islegacyrecord boolean;

ALTER TABLE eg_death_dtls
ADD COLUMN IF NOT EXISTS islegacyrecord boolean;