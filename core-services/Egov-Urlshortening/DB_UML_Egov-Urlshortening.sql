Table "eg_url_shortener" {
  "id" "character varying(128)" [not null]
  "validform" bigint
  "validto" bigint
  "url" "character varying(1024)" [not null]
}

Table "public" {
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
  success [type: btree, name: "public_s_idx"]
}
}
