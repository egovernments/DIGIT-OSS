Table "eg_action" {
  "id" bigint [not null]
  "name" "character varying(100)" [not null]
  "url" "character varying(100)"
  "servicecode" "character varying(50)"
  "queryparams" "character varying(100)"
  "parentmodule" "character varying(50)"
  "ordernumber" bigint
  "displayname" "character varying(100)"
  "enabled" boolean
  "createdby" bigint [default: 1]
  "createddate" timestamp [default: `now()`]
  "lastmodifiedby" bigint [default: 1]
  "lastmodifieddate" timestamp [default: `now()`]
}

Table "eg_ms_role" {
  "name" "character varying(32)" [not null]
  "code" "character varying(50)" [not null]
  "description" "character varying(128)"
  "createddate" timestamp [default: `CURRENT_TIMESTAMP`]
  "createdby" bigint
  "lastmodifiedby" bigint
  "lastmodifieddate" timestamp
  "version" bigint
}

Table "eg_roleaction" {
  "rolecode" "character varying(32)" [not null]
  "actionid" bigint [not null]
  "tenantid" "character varying(50)" [not null]
}

Table "service" {
  "id" bigint [not null]
  "code" "character varying(50)" [not null]
  "name" "character varying(100)" [not null]
  "enabled" boolean
  "contextroot" "character varying(50)"
  "displayname" "character varying(100)"
  "ordernumber" bigint
  "parentmodule" "character varying(100)"
  "tenantid" "character varying(50)" [not null]
}

