Table "message" {
  "id" "character varying(512)" [not null]
  "locale" "character varying(255)" [not null]
  "code" "character varying(255)" [not null]
  "message" "character varying(500)" [not null]
  "tenantid" "character varying(256)" [not null]
  "module" "character varying(255)" [not null]
  "createdby" bigint [not null]
  "createddate" timestamp [not null, default: `now()`]
  "lastmodifiedby" bigint
  "lastmodifieddate" timestamp

Indexes {
  (locale, tenantid) [type: btree, name: "message_locale_tenant"]
}
}
