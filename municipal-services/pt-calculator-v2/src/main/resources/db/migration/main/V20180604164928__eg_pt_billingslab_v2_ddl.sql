CREATE TABLE eg_pt_billingslab_v2(

  id character varying(64),
  tenantId character varying(256),
  propertyType character varying(64),
  propertySubType character varying(64),
  usageCategoryMajor character varying(64),
  usageCategoryMinor character varying(64),
  usageCategorySubMinor character varying(64),
  usageCategoryDetail character varying(64),
  ownerShipCategory character varying(64),
  subOwnerShipCategory character varying(256),
  fromFloor bigint,
  toFloor bigint,
  areaType character varying(64),
  occupancyType character varying(64),
  fromPlotSize bigint,
  toPlotSize bigint,
  unitRate bigint,
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_pt_billingslab_v2 PRIMARY KEY (id, tenantid),
  CONSTRAINT uk_eg_pt_billingslab_v2 UNIQUE (id)
);