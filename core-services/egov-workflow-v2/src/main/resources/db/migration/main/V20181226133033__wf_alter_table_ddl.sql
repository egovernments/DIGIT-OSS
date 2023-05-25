ALTER TABLE eg_wf_processinstance_v2
RENAME COLUMN sla TO stateSla;

ALTER TABLE eg_wf_processinstance_v2
ADD COLUMN moduleName character varying(64);

ALTER TABLE eg_wf_processinstance_v2
ADD COLUMN businessServiceSla bigint;

ALTER TABLE eg_wf_businessservice_v2
ADD COLUMN businessServiceSla bigint;


