CREATE TABLE eg_tl_TradeLicense(

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

  CONSTRAINT uk_eg_tl_TradeLicense UNIQUE (id)
);


CREATE TABLE eg_tl_TradeLicenseDetail(

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

  CONSTRAINT pk_eg_tl_TradeLicenseDetail PRIMARY KEY (id),
  CONSTRAINT fk_eg_tl_TradeLicenseDetail FOREIGN KEY (tradelicenseId) REFERENCES eg_tl_TradeLicense (id)
);


CREATE TABLE eg_tl_TradeUnit(
    id character varying(64) NOT NULL,
    tenantId character varying(64),
    tradetype character varying(64),
    uom character varying(64),
    uomValue character varying(64),
    tradeLicenseDetailId character varying(64) NOT NULL,
    active boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT pk_eg_tl_TradeUnit PRIMARY KEY (id),
    CONSTRAINT fk_eg_tl_TradeUnit FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
);


CREATE TABLE eg_tl_Accessory(
    id character varying(64),
    tenantId character varying(64),
    accessoryCategory character varying(64),
    uom character varying(64),
    uomValue character varying(64),
    tradeLicenseDetailId character varying(64),
    active boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT uk_eg_tl_Accessory PRIMARY KEY (id),
    CONSTRAINT fk_eg_tl_Accessory FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
);


CREATE TABLE eg_tl_ApplicationDocument(
    id character varying(64),
    tenantId character varying(64),
    documentType character varying(64),
    filestoreid character varying(64),
    tradeCategoryDetail character varying(64),
    tradeLicenseDetailId character varying(64),
    active boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT uk_eg_tl_ApplicationDocument PRIMARY KEY (id),
    CONSTRAINT fk_eg_tl_ApplicationDocument FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
);


CREATE TABLE eg_tl_VerificationDocument(
    id character varying(64),
    tenantId character varying(64),
    documentType character varying(64),
    filestoreid character varying(64),
    tradeCategoryDetail character varying(64),
    tradeLicenseDetailId character varying(64),
    active boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT uk_eg_tl_VerificationDocument PRIMARY KEY (id),
    CONSTRAINT fk_eg_tl_VerificationDocument FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
);

CREATE TABLE eg_tl_address(
    id character varying(64),
    tenantId character varying(64),
    doorNo character varying(64),
    latitude FLOAT,
    longitude FLOAT,
    buildingName character varying(64),
    addressId character varying(64),
    addressNumber character varying(64),
    type character varying(64),
    addressLine1 character varying(256),
    addressLine2 character varying(256),
    landmark character varying(64),
    street character varying(64),
    city character varying(64),
    locality character varying(64),
    pincode character varying(64),
    detail character varying(64),
    tradeLicenseDetailId character varying(64),
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT uk_eg_tl_address PRIMARY KEY (id),
    CONSTRAINT fk_eg_tl_address FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);


CREATE TABLE eg_tl_owner(
  id character varying(64),
  tenantId character varying(256),
  tradeLicenseDetailId character varying(64),
  isactive boolean,
  isprimaryowner boolean,
  ownertype character varying(64),
  ownershippercentage character varying(64),
  relationship character varying(64),
  active boolean,
  institutionId character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  CONSTRAINT pk_eg_tl_owner PRIMARY KEY (id,tradeLicenseDetailId),
  CONSTRAINT uk_eg_tl_owner  UNIQUE (id),
  CONSTRAINT fk_eg_tl_owner FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_tl_document_owner (
  tenantId character varying(256),
  id character varying(64),
  tradeLicenseDetailId character varying(64),
  userid character varying(128),
  documenttype character varying(64),
  filestoreId character varying(64),
  active boolean,
  documentuid  character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT uk_eg_tl_document_owner PRIMARY KEY (id),
  CONSTRAINT pk_eg_tl_document_owner UNIQUE (userid, tradeLicenseDetailId),
  CONSTRAINT fk_eg_tl_document_owner FOREIGN KEY (userid, tradeLicenseDetailId) REFERENCES eg_tl_owner (id, tradeLicenseDetailId)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE eg_tl_institution (
  tenantId character varying(256),
  id character varying(64),
  tradeLicenseDetailId character varying(64),
  name character varying(64),
  type character varying(64),
  designation character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_tl_institution PRIMARY KEY (id),
  CONSTRAINT fk_eg_tl_institution FOREIGN KEY (tradeLicenseDetailId) REFERENCES eg_tl_TradeLicenseDetail (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

