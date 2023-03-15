CREATE INDEX IF NOT EXISTS index_eg_pt_address_locality ON eg_pt_address (locality);

CREATE INDEX IF NOT EXISTS index_eg_pt_property_propertyid ON eg_pt_property (propertyid);

CREATE INDEX IF NOT EXISTS index_eg_pt_property_acknowldgementnumber ON eg_pt_property (acknowldgementnumber);

CREATE INDEX IF NOT EXISTS index_eg_pt_property_oldpropertyid ON eg_pt_property (oldpropertyid);

CREATE INDEX IF NOT EXISTS index_eg_pt_address_propertyid ON eg_pt_address (propertyid);

CREATE INDEX IF NOT EXISTS index_eg_pt_institution_propertyid ON eg_pt_institution (propertyid);

CREATE INDEX IF NOT EXISTS index_eg_pt_owner_propertyid ON eg_pt_owner (propertyid);

CREATE INDEX IF NOT EXISTS index_eg_pt_unit_propertyid ON eg_pt_unit (propertyid);

CREATE INDEX IF NOT EXISTS index_eg_pt_asmt_unitusage_assessmentId ON eg_pt_asmt_unitusage (assessmentid);

CREATE INDEX IF NOT EXISTS index_eg_pt_asmt_document_entityid ON eg_pt_asmt_document (entityid);

CREATE INDEX IF NOT EXISTS index_eg_pt_asmt_assessment_financialyear ON eg_pt_asmt_assessment (financialyear);