CREATE TABLE eg_privacy_userinfo_access_audit (
    id character varying(128),
    userid character varying(128),
    accesstime bigint,
    purpose character varying(128),
    model character varying(128),
    entityids character varying(256),
    plainaccessrequest JSONB,
    additionalinfo JSONB
);