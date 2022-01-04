-- droping unique indices and creating ones without uniqueness

DROP INDEX idx_pi_wf_processinstance;

CREATE INDEX idx_pi_wf_processinstance_v2 ON eg_wf_processinstance_v2 (businessId,lastModifiedTime);

DROP INDEX idx_pi_wf_businessservice;

CREATE INDEX idx_pi_wf_businessservice_v2 ON eg_wf_businessservice_v2 (businessservice);

DROP INDEX idx_pi_wf_state;

CREATE INDEX idx_pi_wf_state_v2 ON eg_wf_state_v2 (state);


ALTER TABLE eg_wf_action_v2 DROP CONSTRAINT fk_eg_wf_action;
ALTER TABLE eg_wf_state_v2 DROP CONSTRAINT uk_eg_wf_state;

ALTER TABLE eg_wf_state_v2 ADD CONSTRAINT pk_eg_wf_state_v2 PRIMARY KEY (uuid);
ALTER TABLE eg_wf_state_v2 ADD CONSTRAINT uk_eg_wf_state_v2  UNIQUE (state, businessserviceid);
ALTER TABLE eg_wf_action_v2 ADD CONSTRAINT fk_eg_wf_action_v2 FOREIGN KEY (currentstate) REFERENCES eg_wf_state_v2 (uuid);