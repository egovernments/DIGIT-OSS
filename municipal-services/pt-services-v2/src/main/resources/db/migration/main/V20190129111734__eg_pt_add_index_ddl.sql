CREATE INDEX IF NOT EXISTS idx_eg_pt_property_v2_propertyid ON eg_pt_property_v2 (PropertyId,tenantid);
CREATE INDEX IF NOT EXISTS idx_eg_pt_property_v2_tenantid ON eg_pt_property_v2 (tenantid);
CREATE INDEX IF NOT EXISTS idx_eg_pt_propertydetail_v2_financialyear ON eg_pt_propertydetail_v2 (financialYear);
CREATE INDEX IF NOT EXISTS idx_eg_pt_address_v2_locality ON eg_pt_address_v2 (locality);
CREATE INDEX IF NOT EXISTS idx_eg_pt_unit_v2_usagecategorymajor ON eg_pt_unit_v2 (usagecategorymajor);
