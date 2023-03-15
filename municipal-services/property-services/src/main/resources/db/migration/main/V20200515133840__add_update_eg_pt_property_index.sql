DROP INDEX IF EXISTS  index_eg_pt_property_createdtime_id;
CREATE INDEX IF NOT EXISTS index_eg_pt_property_modifiedtime_id ON eg_pt_property (lastmodifiedtime,id);