ALTER TABLE eg_tl_tradelicensedetail
ADD COLUMN operationalArea FLOAT,
ADD COLUMN noOfEmployees INTEGER,
ADD COLUMN structureType character varying(64),
ADD COLUMN adhocExemption numeric(12,2),
ADD COLUMN adhocPenalty numeric(12,2),
ADD COLUMN adhocExemptionReason character varying(1024),
ADD COLUMN adhocPenaltyReason character varying(1024);



