CREATE TABLE eg_tl_calculator_tradetype(
id CHARACTER VARYING(64),
tenantid CHARACTER VARYING(64),
consumercode CHARACTER VARYING(64),
tradeTypeFeeAndBillingSlabIds JSONB NOT NULL,
createdtime bigint,
createdby varchar,
lastmodifiedtime bigint,
lastmodifiedby varchar,
CONSTRAINT uk_tl_calculator_tradetype  UNIQUE (id)
);

CREATE TABLE eg_tl_calculator_accessory(
id CHARACTER VARYING(64),
tenantid CHARACTER VARYING(64),
consumercode CHARACTER VARYING(64),
accessoryFeeAndBillingSlabIds JSONB  NOT NULL,
createdtime bigint,
createdby varchar,
lastmodifiedtime bigint,
lastmodifiedby varchar,
CONSTRAINT uk_tl_calculator_accessory  UNIQUE (id)
)