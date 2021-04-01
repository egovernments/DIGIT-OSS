------------------START------------------
CREATE TABLE eg_filestoremap (
    id bigint NOT NULL,
    filestoreid character varying(36) NOT NULL,
    filename character varying(100) NOT NULL,
    contenttype character varying(100),
    module character varying(256),
    tag character varying(256),
    tenantid character varying(256) not null,
    version bigint
);
CREATE SEQUENCE seq_eg_filestoremap
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE eg_filestoremap ADD CONSTRAINT pk_filestoremap PRIMARY KEY (id); 
ALTER TABLE eg_filestoremap ADD CONSTRAINT uk_filestoremap_filestoreid UNIQUE (filestoreid);
alter table eg_filestoremap add constraint uk_filestoremap_fsid_tenant unique (filestoreid,tenantid);
-------------------END-------------------