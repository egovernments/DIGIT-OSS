Table "eg_enc_asymmetric_keys" {
  "id" integer [not null]
  "key_id" integer [not null]
  "public_key" text [not null]
  "private_key" text [not null]
  "active" boolean [not null, default: true]
  "tenant_id" text [not null]

Indexes {
  tenant_id [type: btree, unique, name: "active_tenant_asymmetric_keys"]
  key_id [type: btree, unique, name: "eg_asymmetric_key_id"]
}
}

Table "eg_enc_symmetric_keys" {
  "id" integer [not null]
  "key_id" integer [not null]
  "secret_key" text [not null]
  "initial_vector" text [not null]
  "active" boolean [not null, default: true]
  "tenant_id" text [not null]

Indexes {
  tenant_id [type: btree, unique, name: "active_tenant_symmetric_keys"]
  key_id [type: btree, unique, name: "eg_symmetric_key_id"]
}
}

Table "flyway" {
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
  success [type: btree, name: "flyway_s_idx"]
}
}