CREATE TABLE EDCR_DXF_DOCUMENT
(
  id bigint NOT NULL,
  application bigint NOT NULL,
  filestoreid bigint,
  createdby bigint NOT NULL,
  createddate TIMESTAMP without TIME ZONE NOT NULL,
  lastModifiedDate TIMESTAMP without TIME ZONE ,
  lastModifiedBy bigint,
  version NUMERIC NOT NULL,
  CONSTRAINT pk_edcr_dxf_document_id PRIMARY KEY (id),
  CONSTRAINT fk_edcr_dxf_document_application FOREIGN KEY (application) REFERENCES EDCR_APPLICATION(id),
  CONSTRAINT fk_edcr_dxf_document_MDFDBY FOREIGN KEY (lastmodifiedBy) REFERENCES EG_USER (ID),
  CONSTRAINT fk_edcr_dxf_document_CRTBY FOREIGN KEY (createdBy)REFERENCES EG_USER (ID)
);

CREATE SEQUENCE SEQ_EDCR_DXF_DOCUMENT;