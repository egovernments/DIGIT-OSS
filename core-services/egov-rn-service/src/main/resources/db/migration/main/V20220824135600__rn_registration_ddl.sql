CREATE TABLE eg_rn_household
(
    id                 character varying(64),
    tenantId           character varying(64),
    name               character varying(64),
    gender             character varying(20),
    dateOfRegistration date,
    isHead             boolean,
    householdId        character varying(64),
    registrationId     character varying(64),
    createdBy          character varying(64),
    lastModifiedBy     character varying(64),
    createdTime        bigint,
    lastModifiedTime   bigint,
    CONSTRAINT uk_eg_rn_household PRIMARY KEY (id)
);