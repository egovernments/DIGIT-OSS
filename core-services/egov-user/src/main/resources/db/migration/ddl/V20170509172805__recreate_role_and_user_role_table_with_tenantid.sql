DROP TABLE eg_userrole;
ALTER TABLE eg_role ADD roleid bigint NOT NULL DEFAULT 0;
UPDATE eg_role SET roleid = id;
ALTER TABLE eg_role ALTER COLUMN roleid DROP DEFAULT;
ALTER TABLE eg_role DROP COLUMN id;
ALTER TABLE eg_role RENAME COLUMN roleid TO id;
ALTER TABLE eg_role ADD CONSTRAINT eg_role_pk PRIMARY KEY (id, tenantid);

CREATE TABLE eg_userrole (
    roleid bigint NOT NULL,
    roleidtenantid character varying(256) NOT NULL,
    userid bigint NOT NULL,
    tenantid character varying(256) NOT NULL,
    FOREIGN KEY (roleid, roleidtenantid) REFERENCES eg_role (id, tenantid),
    FOREIGN KEY (userid, tenantid) REFERENCES eg_user (id, tenantid)
);