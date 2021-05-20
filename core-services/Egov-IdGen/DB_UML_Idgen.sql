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

Table "id_generator" {
  "id" bigint [not null]
  "idname" "character varying(200)" [not null]
  "tenantid" "character varying(200)" [not null]
  "format" "character varying(200)" [not null]
  "sequencenumber" integer [not null]
}