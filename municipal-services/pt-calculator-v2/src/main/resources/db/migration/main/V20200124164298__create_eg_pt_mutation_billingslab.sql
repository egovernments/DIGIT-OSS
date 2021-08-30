CREATE TABLE eg_pt_mutation_billingslab
(
    id character varying(64) NOT NULL,
    tenantid character varying(256) NOT NULL,
    propertyType character varying(64),
    propertySubType character varying(64),
    usageCategoryMajor character varying(64),
    usageCategoryMinor character varying(64),
    usageCategorySubMinor character varying(64),
    usageCategoryDetail character varying(64),
    ownershipCategory character varying(64),
    subOwnershipCategory character varying(64),
    minMarketValue float,
    maxMarketValue float,
    fixedAmount float,
    rate float,
    method character varying(64)
);
