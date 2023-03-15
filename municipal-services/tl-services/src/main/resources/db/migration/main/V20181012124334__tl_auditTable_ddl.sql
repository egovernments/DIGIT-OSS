CREATE TABLE eg_tl_TradeLicense_audit(

  id character varying(64),
  accountid character varying(64),
  tenantId character varying(64),
  licenseType character varying(64),
  licenseNumber character varying(64),
  applicationNumber character varying(64),
  oldLicenseNumber character varying(64),
  propertyId character varying(256),
  oldPropertyId character varying(64),
  applicationDate bigint,
  commencementDate bigint,
  issuedDate bigint,
  financialYear character varying(64),
  validFrom bigint,
  validTo bigint,
  action character varying(64),
  status character varying(64),
  createdBy character varying(64),
  lastModifiedBy character varying(64),
  createdTime bigint,
  lastModifiedTime bigint,
  tradeName character varying(256)

);


CREATE TABLE eg_tl_TradeLicenseDetail_audit(

  id character varying(64),
  surveyNo character varying(64),
  subOwnerShipCategory character varying(64),
  channel character varying(64),
  additionalDetail JSONB,
  tradelicenseId character varying(256),
  createdBy character varying(64),
  lastModifiedBy character varying(64),
  createdTime bigint,
  lastModifiedTime bigint,
  operationalArea FLOAT,
  noOfEmployees INTEGER,
  structureType character varying(64),
  adhocExemption numeric(12,2),
  adhocPenalty numeric(12,2),
  adhocExemptionReason character varying(1024),
  adhocPenaltyReason character varying(1024)

);
