ALTER TABLE eg_pt_asmt_unitusage DROP CONSTRAINT fk_eg_pt_asmt_unitusage;
ALTER TABLE eg_pt_asmt_unitusage ADD CONSTRAINT fk_eg_pt_asmt_unitusage FOREIGN KEY (assessmentId) REFERENCES eg_pt_asmt_assessment (id);


ALTER TABLE eg_pt_asmt_document ALTER COLUMN documentType DROP NOT NULL;
ALTER TABLE eg_pt_asmt_document ALTER COLUMN documentuid DROP NOT NULL;
ALTER TABLE eg_pt_asmt_document ALTER COLUMN status DROP NOT NULL;