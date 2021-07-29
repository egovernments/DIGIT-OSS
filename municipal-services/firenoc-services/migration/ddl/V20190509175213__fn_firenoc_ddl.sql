-- Table: public.eg_fn_firenoc

-- DROP TABLE public.eg_fn_firenoc;

CREATE TABLE eg_fn_address
(
    uuid character varying(64) NOT NULL,
    tenantid character varying(64),
    doorno character varying(64),
    latitude double precision,
    longitude double precision,
    buildingname character varying(64),
    addressid character varying(64),
    addressnumber character varying(64),
    type character varying(64),
    addressline1 character varying(256),
    addressline2 character varying(256),
    landmark character varying(64),
    street character varying(64),
    city character varying(64),
    locality character varying(64),
    pincode character varying(64),
    detail character varying(64),
    firenocdetailsuuid character varying(64),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT uk_eg_fn_address PRIMARY KEY (uuid)
);

CREATE TABLE eg_fn_buidlings
(
    uuid character varying(64) NOT NULL,
    firenocdetailsuuid character varying(64),
    tenantid character varying(64),
    name character varying(128),
    usagetype character varying(64),
    nooffloors bigint,
    noofbasements bigint,
    plotsize bigint,
    builtuparea bigint,
    heightofbuilding bigint,
    additionalunitdetail jsonb,
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_fn_buildings PRIMARY KEY (uuid)
);


CREATE TABLE eg_fn_buildingdocuments (
  uuid character varying(64) NOT NULL,
  tenantid character varying(256),
  firenocdetailsuuid character varying(64),
  documenttype character varying(64),
  filestoreid character varying(64),
  active boolean,
  documentuid character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  buildingId character varying(64),
  CONSTRAINT uk_eg_fn_building_documents PRIMARY KEY (uuid),
  CONSTRAINT pk_eg_fn_building_documents UNIQUE (uuid, firenocdetailsuuid)
);

CREATE TABLE eg_fn_firenoc
(
    uuid character varying(64) NOT NULL,
    tenantid character varying(128),
    firenocnumber character varying(64),
    provisionfirenocnumber character varying(64),
    oldfirenocnumber character varying(64),
    dateofapplied character varying(256),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT uk_eg_fn_firenoc UNIQUE (uuid)
);

CREATE TABLE eg_fn_firenocdetail
(
    uuid character varying(64) NOT NULL,
    firenocuuid character varying(128),
    applicationnumber character varying(64),
    firenoctype character varying(64),
    firestationid character varying(64),
    applicationdate bigint,
    financialyear character varying(64),
    issueddate bigint,
    validfrom bigint,
    validto bigint,
    action character varying(64),
    channel character varying(64),
    noofbuildings character varying(64),
    tenantid character varying(128),
    additionaldetail jsonb,
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    propertyid character varying(64),
    CONSTRAINT pk_eg_fn_firenocdetail PRIMARY KEY (uuid)
);

CREATE TABLE eg_fn_institution
(
    uuid character varying(64) NOT NULL,
    tenantid character varying(256),
    firenocdetailsuuid character varying(64),
    name character varying(64),
    type character varying(64),
    designation character varying(64),
    createdby character varying(64),
    createdtime bigint,
    lastmodifiedby character varying(64),
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_fn_institution PRIMARY KEY (uuid)
);

CREATE TABLE eg_fn_owner (
  uuid character varying(64) NOT NULL,
  tenantid character varying(256),
  firenocdetailsuuid character varying(64),
  isactive boolean,
  isprimaryowner boolean,
  ownertype character varying(64),
  ownershippercentage character varying(64),
  relationship character varying(64),
  active boolean,
  institutionid character varying(64),
  createdby character varying(64),
  createdtime bigint,
  lastmodifiedby character varying(64),
  lastmodifiedtime bigint,
  CONSTRAINT pk_eg_fn_owner PRIMARY KEY (uuid, firenocdetailsuuid),
  CONSTRAINT uk_eg_fn_owner UNIQUE (uuid)
);
