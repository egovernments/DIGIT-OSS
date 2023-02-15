CREATE TABLE egov_bulk_pdf_info
(
  jobid character varying(100) NOT NULL,
  uuid character varying(256) NOT NULL,
  recordscompleted bigint,
  totalrecords bigint,
  createdtime bigint,
  filestoreid character varying(50),
  lastmodifiedby character varying(256) NOT NULL,
  lastmodifiedtime bigint,
  CONSTRAINT egov_bulk_pdf_info_pkey PRIMARY KEY (jobid)
);