CREATE INDEX  index_eg_pt_property_oldPropertyId ON eg_pt_property (oldPropertyId);
CREATE INDEX  index_eg_pt_property_status ON eg_pt_property (status);
CREATE INDEX  index_eg_pt_property_acknowldgementNumber ON eg_pt_property (acknowldgementNumber);

CREATE INDEX  index_eg_pt_owner_status ON eg_pt_property (status);
CREATE INDEX  index_eg_pt_document_status ON eg_pt_property (status);
