CREATE TABLE eg_wf_assignee_v2(

    processinstanceid character varying(64),
    tenantid character varying(128),
    assignee character varying(128),
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT fk_eg_wf_assignee_v2 FOREIGN KEY (processinstanceid) REFERENCES eg_wf_processinstance_v2 (id)

    ON UPDATE CASCADE
    ON DELETE CASCADE
);



