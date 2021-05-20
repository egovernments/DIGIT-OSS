Table "eg_token" {
  "id" character(36) [not null]
  "tenantid" "character varying(256)" [not null]
  "tokennumber" "character varying(128)" [not null]
  "tokenidentity" "character varying(100)" [not null]
  "ttlsecs" bigint [not null]
  "createddate" timestamp [not null]
  "lastmodifieddate" timestamp
  "createdby" bigint [not null]
  "lastmodifiedby" bigint
  "version" bigint
  "createddatenew" bigint

Indexes {
  (tokennumber, tokenidentity, tenantid) [type: btree, name: "idx_token_number_identity_tenant"]
}
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
