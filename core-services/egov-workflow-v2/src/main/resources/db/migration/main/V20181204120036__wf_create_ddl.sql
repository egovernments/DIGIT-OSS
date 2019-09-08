CREATE TABLE eg_wf_processinstance_v2(

    id character varying(64),
    tenantid character varying(128),
    businessService character varying(128),
    businessId character varying(128),
    action character varying(128),
    status character varying(128),
    comment character varying(128),
    assigner character varying(128),
    assignee character varying(128),
    sla bigint,
    previousStatus character varying(128),
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,
    CONSTRAINT uk_eg_wf_processinstance UNIQUE (id)
);

CREATE UNIQUE INDEX idx_pi_wf_processinstance ON eg_wf_processinstance_v2 (businessId,lastModifiedTime);


CREATE TABLE eg_wf_Document_v2(
    id character varying(64),
    tenantId character varying(64),
    documentType character varying(64),
    documentUid character varying(64),
    filestoreid character varying(64),
    processinstanceid character varying(64),
    active boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,

    CONSTRAINT uk_eg_wf_Document PRIMARY KEY (id),
    CONSTRAINT fk_eg_wf_Document FOREIGN KEY (processinstanceid) REFERENCES eg_wf_processinstance_v2 (id)

    ON UPDATE CASCADE
    ON DELETE CASCADE
);


CREATE TABLE eg_wf_businessservice_v2
(
  businessservice character varying(256) NOT NULL,
  business character varying(256) NOT NULL,
  tenantid character varying(256) NOT NULL,
  uuid character varying(256) NOT NULL,
  geturi character varying(1024),
  posturi character varying(1024),
  createdby character varying(256) NOT NULL,
  createdtime bigint,
  lastmodifiedby character varying(256) NOT NULL,
  lastmodifiedtime bigint,

  CONSTRAINT pk_eg_wf_businessservice PRIMARY KEY (uuid),
  CONSTRAINT uk_eg_wf_businessservice UNIQUE (tenantid,businessService)
);

CREATE UNIQUE INDEX idx_pi_wf_businessservice ON eg_wf_businessservice_v2 (businessservice);


CREATE TABLE eg_wf_state_v2
(
  uuid character varying(256) NOT NULL,
  tenantid character varying(256) NOT NULL,
  businessserviceid character varying(256) NOT NULL, --Foreign key uuid of eg_wf_businessservice_v2
  state character varying(256),
  applicationStatus character varying(256),
  sla bigint,
  docuploadrequired boolean,
  isstartstate boolean,
  isterminatestate boolean,
  createdby character varying(256) NOT NULL,
  createdtime bigint,
  lastmodifiedby character varying(256) NOT NULL,
  lastmodifiedtime bigint,

  CONSTRAINT uk_eg_wf_state PRIMARY KEY (uuid),
  CONSTRAINT fk_eg_wf_state FOREIGN KEY (businessserviceid) REFERENCES eg_wf_businessservice_v2 (uuid)

  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_pi_wf_state ON eg_wf_state_v2 (state);

CREATE TABLE eg_wf_action_v2
(
  uuid character varying(256) NOT NULL,
  tenantid character varying(256) NOT NULL,
  currentstate character varying(256),
  action character varying(256) NOT NULL,
  nextstate character varying(256),
  roles character varying(1024) NOT NULL,
  createdby character varying(256) NOT NULL,
  createdtime bigint,
  lastmodifiedby character varying(256) NOT NULL,
  lastmodifiedtime bigint,

   CONSTRAINT uk_eg_wf_action PRIMARY KEY (uuid),
   CONSTRAINT fk_eg_wf_action FOREIGN KEY (currentstate) REFERENCES eg_wf_state_v2 (uuid)

   ON UPDATE CASCADE
   ON DELETE CASCADE
);

CREATE INDEX idx_pi_wf_action ON eg_wf_action_v2 (action);


