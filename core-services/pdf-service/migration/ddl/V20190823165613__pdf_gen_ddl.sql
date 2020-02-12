CREATE TABLE egov_pdf_gen
(
  jobid character varying(100) NOT NULL,
  tenantid character varying(50),
  createdtime bigint,
  filestoreids json,
  endtime bigint,
  CONSTRAINT egov_pdf_gen_pkey PRIMARY KEY (jobid)
)