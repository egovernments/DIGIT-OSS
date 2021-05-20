Table "eg_filestoremap" {
  "id" bigint [not null]
  "filestoreid" "character varying(36)" [not null]
  "filename" "character varying(256)" [not null]
  "contenttype" "character varying(100)"
  "module" "character varying(256)"
  "tag" "character varying(256)"
  "tenantid" "character varying(256)" [not null]
  "version" bigint
  "filesource" "character varying(64)"
  "createdby" "character varying(64)"
  "lastmodifiedby" "character varying(64)"
  "createdtime" bigint
  "lastmodifiedtime" bigint
}

Table "egov_filestore_schema_version" {
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
  success [type: btree, name: "egov_filestore_schema_version_s_idx"]
}
}
