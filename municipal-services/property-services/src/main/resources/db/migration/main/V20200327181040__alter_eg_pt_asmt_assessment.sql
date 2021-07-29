ALTER TABLE eg_pt_asmt_assessment ALTER COLUMN createdby DROP NOT NULL;
ALTER TABLE eg_pt_asmt_assessment ALTER COLUMN lastmodifiedby DROP NOT NULL;
ALTER TABLE eg_pt_asmt_unitusage ALTER COLUMN createdby DROP NOT NULL;
ALTER TABLE eg_pt_asmt_unitusage ALTER COLUMN lastmodifiedby DROP NOT NULL;

ALTER TABLE eg_pt_property ALTER COLUMN createdby DROP NOT NULL;
ALTER TABLE eg_pt_owner ALTER COLUMN createdby DROP NOT NULL;
ALTER TABLE eg_pt_address ALTER COLUMN createdby DROP NOT NULL;
ALTER TABLE eg_pt_unit ALTER COLUMN createdby DROP NOT NULL;