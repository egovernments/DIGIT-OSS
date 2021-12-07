ALTER TABLE egov_bulk_pdf_info add column status character varying(50) DEFAULT 'DONE';
UPDATE egov_bulk_pdf_info SET status = 'INPROGRESS' WHERE recordscompleted < totalrecords;