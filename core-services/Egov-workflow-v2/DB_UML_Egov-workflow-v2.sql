Table "eg_wf_action_v2" {
  "uuid" "character varying(256)" [not null]
  "tenantid" "character varying(256)" [not null]
  "currentstate" "character varying(256)"
  "action" "character varying(256)" [not null]
  "nextstate" "character varying(256)"
  "roles" "character varying(1024)" [not null]
  "createdby" "character varying(256)" [not null]
  "createdtime" bigint
  "lastmodifiedby" "character varying(256)" [not null]
  "lastmodifiedtime" bigint

Indexes {
  action [type: btree, name: "idx_pi_wf_action"]
}
}

Table "eg_wf_assignee_v2" {
  "processinstanceid" "character varying(64)"
  "tenantid" "character varying(128)"
  "assignee" "character varying(128)"
  "createdby" "character varying(64)"
  "lastmodifiedby" "character varying(64)"
  "createdtime" bigint
  "lastmodifiedtime" bigint

Indexes {
  (tenantid, assignee) [type: btree, name: "idx_eg_wf_assignee_v2_assignee"]
  processinstanceid [type: btree, name: "idx_processinstanceid_eg_wf_assignee_v2"]
}
}

Table "eg_wf_businessservice_v2" {
  "businessservice" "character varying(256)" [not null]
  "business" "character varying(256)" [not null]
  "tenantid" "character varying(256)" [not null]
  "uuid" "character varying(256)" [not null]
  "geturi" "character varying(1024)"
  "posturi" "character varying(1024)"
  "createdby" "character varying(256)" [not null]
  "createdtime" bigint
  "lastmodifiedby" "character varying(256)" [not null]
  "lastmodifiedtime" bigint
  "businessservicesla" bigint

Indexes {
  businessservice [type: btree, name: "idx_pi_wf_businessservice_v2"]
}
}

Table "eg_wf_document_v2" {
  "id" "character varying(64)" [not null]
  "tenantid" "character varying(64)"
  "documenttype" "character varying(64)"
  "documentuid" "character varying(64)"
  "filestoreid" "character varying(64)"
  "processinstanceid" "character varying(64)"
  "active" boolean
  "createdby" "character varying(64)"
  "lastmodifiedby" "character varying(64)"
  "createdtime" bigint
  "lastmodifiedtime" bigint
}

Table "eg_wf_processinstance_v2" {
  "id" "character varying(64)"
  "tenantid" "character varying(128)"
  "businessservice" "character varying(128)"
  "businessid" "character varying(128)"
  "action" "character varying(128)"
  "status" "character varying(128)"
  "comment" "character varying(1024)"
  "assigner" "character varying(128)"
  "assignee" "character varying(128)"
  "statesla" bigint
  "previousstatus" "character varying(128)"
  "createdby" "character varying(64)"
  "lastmodifiedby" "character varying(64)"
  "createdtime" bigint
  "lastmodifiedtime" bigint
  "modulename" "character varying(64)"
  "businessservicesla" bigint
  "rating" smallint

Indexes {
  (businessid, lastmodifiedtime) [type: btree, name: "idx_pi_wf_processinstance_v2"]
}
}

Table "eg_wf_state_v2" {
  "uuid" "character varying(256)" [not null]
  "tenantid" "character varying(256)" [not null]
  "businessserviceid" "character varying(256)" [not null]
  "state" "character varying(256)"
  "applicationstatus" "character varying(256)"
  "sla" bigint
  "docuploadrequired" boolean
  "isstartstate" boolean
  "isterminatestate" boolean
  "createdby" "character varying(256)" [not null]
  "createdtime" bigint
  "lastmodifiedby" "character varying(256)" [not null]
  "lastmodifiedtime" bigint
  "seq" integer
  "isstateupdatable" boolean

Indexes {
  state [type: btree, name: "idx_pi_wf_state_v2"]
}
}


Ref:"eg_wf_state_v2"."uuid" < "eg_wf_action_v2"."currentstate"

Ref:"eg_wf_processinstance_v2"."id" < "eg_wf_assignee_v2"."processinstanceid" [update: cascade, delete: cascade]

Ref:"eg_wf_processinstance_v2"."id" < "eg_wf_document_v2"."processinstanceid" [update: cascade, delete: cascade]

Ref:"eg_wf_businessservice_v2"."uuid" < "eg_wf_state_v2"."businessserviceid" [update: cascade, delete: cascade]
