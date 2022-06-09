CREATE TABLE nss_ingest_data(
    uuid character varying(128),
    datakey character varying(2048),
    CONSTRAINT pk_nss_ingest_data PRIMARY KEY (uuid)
);