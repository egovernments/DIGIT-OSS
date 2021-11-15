CREATE TABLE eg_du_document(
    uuid character varying(128),
    tenantid character varying(128),
    name character varying(128),
    category character varying(128),
    description character varying(140),
    filestoreId character varying(1024),
    documentLink character varying(1024),
    postedby character varying(128),
    active boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,
    CONSTRAINT uk_eg_du_document UNIQUE (uuid),
    CONSTRAINT pk_eg_du_document PRIMARY KEY (tenantid,category,name,active)
);