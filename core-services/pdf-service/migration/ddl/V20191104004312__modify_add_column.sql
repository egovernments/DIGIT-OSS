alter table egov_pdf_gen add column entityid character varying(50),add column id character varying(50) NOT NULL,add column isconsolidated boolean,add column createdby bigint,add column modifiedby bigint;
ALTER TABLE egov_pdf_gen DROP CONSTRAINT egov_pdf_gen_pkey;
ALTER TABLE egov_pdf_gen ADD PRIMARY KEY (id);