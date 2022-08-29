CREATE TABLE eg_rn_household
(
    id                 character varying(64),
    tenantId           character varying(64),
    name               character varying(64),
    gender             character varying(20),
    isHead             boolean,
    householdId        character varying(64),
    dateOfBirth        bigint,
    dateOfRegistration bigint,
    md5Hash            character varying(32),
    createdBy          character varying(64),
    lastModifiedBy     character varying(64),
    createdTime        bigint,
    lastModifiedTime   bigint,
    CONSTRAINT uk_eg_rn_household_rid PRIMARY KEY (id),
    CONSTRAINT uk_eg_rn_household_hash UNIQUE (md5Hash)
);