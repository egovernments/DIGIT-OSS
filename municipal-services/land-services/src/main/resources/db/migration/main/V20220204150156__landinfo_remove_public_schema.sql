CREATE TABLE IF NOT EXISTS eg_land_auditdetails
(
    id character varying(256) COLLATE pg_catalog."default" NOT NULL,
    landUid character varying(64) COLLATE pg_catalog."default",
    landUniqueRegNo character varying(256) COLLATE pg_catalog."default",
    tenantId character varying(64) COLLATE pg_catalog."default",
    status character varying(64) COLLATE pg_catalog."default",
    ownershipcategory character varying(64) COLLATE pg_catalog."default",
    source character varying(64) COLLATE pg_catalog."default",
    channel character varying(64) COLLATE pg_catalog."default",
    additionaldetails jsonb,
    createdby character varying(64) COLLATE pg_catalog."default",
    lastmodifiedby character varying(64) COLLATE pg_catalog."default",
    createdtime bigint,
    lastmodifiedtime bigint
);