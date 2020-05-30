CREATE TABLE eg_cms_case (
    tenantid text not null,
    age int,
    startdate bigint,
    enddate bigint,
    reason text,
    medicalhistory text,
    status text not null,
    healthdetails jsonb,
    caseid text not null,
    uuid text not null,
    userUuid text not null,
    signature text not null,
    createdby text not null,
    lastmodifiedby text not null,
    createdtime bigint not null,
    lastmodifiedtime bigint not null,
    additionaldetails jsonb,

    CONSTRAINT pk_eg_cms_case_uuid PRIMARY KEY (uuid),
    CONSTRAINT uk_eg_cms_case_caseid UNIQUE (caseid)
);