Table "eg_boundary" {
  "id" bigint [not null]
  "boundarynum" bigint [not null]
  "parent" bigint
  "name" "character varying(512)" [not null]
  "boundarytype" bigint [not null]
  "localname" "character varying(256)"
  "bndry_name_old" "character varying(256)"
  "bndry_name_old_local" "character varying(256)"
  "fromdate" timestamp
  "todate" timestamp
  "bndryid" bigint
  "materializedpath" "character varying(32)"
  "ishistory" boolean
  "createddate" timestamp
  "lastmodifieddate" timestamp
  "createdby" bigint
  "lastmodifiedby" bigint
  "version" bigint
  "tenantid" "character varying(256)" [not null]
  "code" "character varying(22)" [not null]
}

Table "eg_boundary_type" {
  "id" bigint [not null]
  "hierarchy" bigint [not null]
  "parent" bigint
  "name" "character varying(64)" [not null]
  "hierarchytype" bigint [not null]
  "createddate" timestamp
  "lastmodifieddate" timestamp
  "createdby" bigint
  "lastmodifiedby" bigint
  "version" bigint
  "localname" "character varying(64)"
  "code" "character varying(22)" [not null]
  "tenantid" "character varying(256)" [not null]
}

Table "eg_city" {
  "domainurl" "character varying(128)" [not null]
  "name" "character varying(256)" [not null]
  "local_name" "character varying(256)"
  "id" bigint [not null]
  "active" boolean
  "version" bigint
  "createdby" numeric
  "lastmodifiedby" numeric
  "code" "character varying(4)"
  "district_code" "character varying(10)"
  "district_name" "character varying(50)"
  "preferences" numeric
  "region_name" "character varying(50)"
  "grade" "character varying(50)"
  "tenantid" "character varying(256)" [not null]
}

Table "eg_citypreferences" {
  "id" numeric [not null]
  "municipality_logo" bigint
  "createdby" numeric
  "lastmodifiedby" numeric
  "version" numeric
  "tenantid" "character varying(256)" [not null]
  "municipality_name" "character varying(50)"
  "municipality_contact_no" "character varying(20)"
  "municipality_address" "character varying(200)"
  "municipality_contact_email" "character varying(50)"
  "municipality_gis_location" "character varying(100)"
  "municipality_callcenter_no" "character varying(20)"
  "municipality_facebooklink" "character varying(100)"
  "municipality_twitterlink" "character varying(100)"
}

Table "eg_crosshierarchy" {
  "id" bigint [not null]
  "parent" bigint [not null]
  "child" bigint [not null]
  "parenttype" bigint
  "childtype" bigint
  "version" bigint [default: 0]
  "tenantid" "character varying(256)" [not null]
  "code" "character varying(100)"
  "createddate" timestamp
  "lastmodifieddate" timestamp
  "createdby" bigint
  "lastmodifiedby" bigint
}

Table "eg_hierarchy_type" {
  "id" bigint [not null]
  "name" "character varying(128)" [not null]
  "code" "character varying(50)" [not null]
  "createddate" timestamp
  "lastmodifieddate" timestamp
  "createdby" bigint
  "lastmodifiedby" bigint
  "version" bigint
  "tenantid" "character varying(256)" [not null]
  "localname" "character varying(256)"
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

Ref:"eg_citypreferences"."id" < "eg_city"."preferences"
