CREATE INDEX IF NOT EXISTS index_eg_pt_property_createdtime_id ON eg_pt_property (createdtime,id);
DROP INDEX IF EXISTS  index_eg_pt_property_audit_audituuid