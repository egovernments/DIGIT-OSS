CREATE TABLE EG_WF_ACTION (
    id bigint NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(1024) NOT NULL,
    createdby bigint,
    createddate timestamp without time zone,
    lastModifiedBy bigint,
    lastModifiedDate timestamp without time zone,
    version bigint default 0
);

ALTER TABLE ONLY EG_WF_ACTION ADD CONSTRAINT eg_wf_action_name_type_key UNIQUE (name, type);
ALTER TABLE ONLY EG_WF_ACTION ADD CONSTRAINT eg_wf_action_pkey PRIMARY KEY (id);