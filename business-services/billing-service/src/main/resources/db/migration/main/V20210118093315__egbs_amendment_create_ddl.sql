CREATE TABLE EGBS_AMENDMENT
(
   id CHARACTER VARYING (256) NOT NULL,
   tenantid CHARACTER VARYING (256) NOT NULL,
   amendmentId CHARACTER VARYING (256) NOT NULL,
   businessservice CHARACTER VARYING (256) NOT NULL,
   consumercode CHARACTER VARYING (256) NOT NULL,
   amendmentReason CHARACTER VARYING (256) NOT NULL,
   reasonDocumentNumber CHARACTER VARYING (256),
   status CHARACTER VARYING (256) NOT NULL,
   effectiveTill BIGINT,
   effectiveFrom BIGINT,
   amendedDemandId CHARACTER VARYING (256),
   createdby CHARACTER VARYING (256) NOT NULL,
   createdtime BIGINT NOT NULL,
   lastmodifiedby CHARACTER VARYING (256) NOT NULL,
   lastmodifiedtime BIGINT NOT NULL,
   additionaldetails JSONB,
   
   CONSTRAINT pk_egbs_amendment PRIMARY KEY (amendmentId, tenantid),
   CONSTRAINT uk_egbs_amendment UNIQUE (id)
);

CREATE TABLE EGBS_AMENDMENT_TAXDETAIL
(
   id CHARACTER VARYING (128) NOT NULL,
   amendmentid CHARACTER VARYING (128) NOT NULL,
   taxheadcode CHARACTER VARYING (250) NOT NULL,
   taxamount NUMERIC (12,2) NOT NULL,
   
   CONSTRAINT pk_egbs_amendment_taxdetail PRIMARY KEY (id, amendmentid)
);

CREATE TABLE egbs_document
(
   id CHARACTER VARYING (128) NOT NULL,
   amendmentid CHARACTER VARYING (256) NOT NULL,
   documentType CHARACTER VARYING (256) NOT NULL,
   fileStoreid CHARACTER VARYING (256) NOT NULL,
   documentuid CHARACTER VARYING (256),
   status CHARACTER VARYING (256) NOT NULL,
   
   CONSTRAINT pk_egbs_document_id PRIMARY KEY (id)
);