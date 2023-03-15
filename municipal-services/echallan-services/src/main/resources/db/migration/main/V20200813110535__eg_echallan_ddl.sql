CREATE TABLE eg_echallan(
  id character varying(64),
  accountid character varying(64),
  tenantId character varying(64),
  challanNo character varying(64),
  businessService character varying(64),
  referenceId character varying(64),
  applicationStatus character varying(64),
  additionalDetail JSONB,
  taxPeriodFrom bigint,
  taxPeriodTo bigint,
  createdBy character varying(64),
  lastModifiedBy character varying(64),
  createdTime bigint,
  lastModifiedTime bigint,
  
  CONSTRAINT uk_eg_echallan UNIQUE (id)      
);

CREATE TABLE eg_challan_address(
    id character varying(64),
    tenantId character varying(64),
    doorNo character varying(64),
    plotNo character varying(64),
    latitude FLOAT,
    longitude FLOAT,
    buildingName character varying(64),
   	landmark character varying(64),
    street character varying(64),
    city character varying(64),
    district character varying(64),
    region character varying(64),
    state character varying(64),
    country character varying(64),
    locality character varying(64),
    pincode character varying(64),
    detail character varying(64),
    echallanId character varying(64),
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT uk_eg_challan_address PRIMARY KEY (id),
    CONSTRAINT fk_eg_challan_address FOREIGN KEY (echallanId) REFERENCES eg_echallan (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);