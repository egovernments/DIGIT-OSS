CREATE TABLE EDCR_PDF_DETAIL
(
  id bigint NOT NULL,
  applicationdetail bigint NOT NULL,
  layer character varying(512),
  convertedpdf bigint,
  failedLayers character varying(512),
  version numeric DEFAULT 0,
  createdBy bigint,
  createdDate timestamp without time zone,
  lastModifiedBy bigint,
  lastModifiedDate timestamp without time zone,
  CONSTRAINT pk_edcr_pdf_detail_id PRIMARY KEY (id),
  CONSTRAINT fk_edcr_pdf_detail_application FOREIGN KEY (applicationdetail) REFERENCES EDCR_APPLICATION_DETAIL(id)
);


CREATE SEQUENCE SEQ_EDCR_PDF_DETAIL;