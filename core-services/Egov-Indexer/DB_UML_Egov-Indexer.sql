Table "eg_indexer_job" {
  "tenantid" "character varying(256)" [not null]
  "jobid" "character varying(500)" [not null]
  "requesterid" "character varying(256)"
  "typeofjob" "character varying(256)" [not null]
  "oldindex" "character varying(1024)"
  "newindex" "character varying(256)" [not null]
  "jobstatus" "character varying(256)" [not null]
  "totaltimetakeninms" bigint [not null]
  "createdby" "character varying(256)" [not null]
  "createdtime" bigint [not null]
  "lastmodifiedby" "character varying(256)"
  "lastmodifiedtime" bigint
  "recordstobeindexed" bigint
  "totalrecordsindexed" bigint
}

Table "flyway_schema_history" {
  "installed_rank" integer [not null]
  "version" "character varying(50)"
  "description" "character varying(200)" [not null]
  "type" "character varying(20)" [not null]
  "script" "character varying(1000)" [not null]
  "checksum" integer
  "installed_by" "character varying(100)" [not null]
  "installed_on" timestamp [not null, default: `now()`]
  "execution_time" integer [not null]
  "success" boolean [not null]

Indexes {
  success [type: btree, name: "flyway_schema_history_s_idx"]
}
}