ALTER TABLE eg_pt_property_v2
ADD COLUMN additionalDetails JSONB;

ALTER TABLE eg_pt_property_audit_v2
ADD COLUMN additionalDetails JSONB;
