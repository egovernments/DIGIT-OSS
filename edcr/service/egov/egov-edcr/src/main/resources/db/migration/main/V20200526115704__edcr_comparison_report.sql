CREATE TABLE edcr_oc_comparison_detail
(
  id bigint NOT NULL,
  ocdcrnumber CHARACTER VARYING (128),
  dcrnumber CHARACTER VARYING (128),
  occomparisonreport bigint,
  tenantid CHARACTER VARYING (128),
  status CHARACTER VARYING (128),
  createdby bigint NOT NULL,
  createddate TIMESTAMP without TIME ZONE NOT NULL,
  lastModifiedDate TIMESTAMP without TIME ZONE ,
  lastModifiedBy bigint,
  version NUMERIC NOT NULL,
  CONSTRAINT pk_edcr_oc_comparison_detail_id PRIMARY KEY (id)
);

CREATE SEQUENCE SEQ_EDCR_OC_COMPARISON_DETAIL;