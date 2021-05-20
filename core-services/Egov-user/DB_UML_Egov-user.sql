Table "eg_address" {
  "housenobldgapt" "character varying(32)"
  "subdistrict" "character varying(100)"
  "postoffice" "character varying(100)"
  "landmark" "character varying(256)"
  "country" "character varying(50)"
  "type" "character varying(50)"
  "streetroadline" "character varying(256)"
  "citytownvillage" "character varying(256)"
  "arealocalitysector" "character varying(256)"
  "district" "character varying(100)"
  "state" "character varying(100)"
  "pincode" "character varying(10)"
  "id" integer [not null]
  "version" bigint [default: 0]
  "tenantid" "character varying(256)" [not null]
  "userid" bigint
}

Table "eg_role" {
  "name" "character varying(128)" [not null]
  "code" "character varying(50)" [not null]
  "description" "character varying(128)"
  "createddate" timestamp [default: `CURRENT_TIMESTAMP`]
  "createdby" bigint
  "lastmodifiedby" bigint
  "lastmodifieddate" timestamp
  "version" bigint
  "tenantid" "character varying(256)" [not null]
  "id" bigint [not null]

Indexes {
  code [type: btree, name: "idx_eg_role_code"]
}
}

Table "eg_user" {
  "title" "character varying(8)"
  "salutation" "character varying(5)"
  "dob" timestamp
  "locale" "character varying(16)"
  "username" "character varying(180)" [not null]
  "password" "character varying(64)" [not null]
  "pwdexpirydate" timestamp [default: `CURRENT_TIMESTAMP`]
  "mobilenumber" "character varying(150)"
  "altcontactnumber" "character varying(150)"
  "emailid" "character varying(300)"
  "createddate" timestamp
  "lastmodifieddate" timestamp
  "createdby" bigint
  "lastmodifiedby" bigint
  "active" boolean
  "name" "character varying(250)"
  "gender" smallint
  "pan" "character varying(65)"
  "aadhaarnumber" "character varying(85)"
  "type" "character varying(50)"
  "version" numeric [default: 0]
  "guardian" "character varying(250)"
  "guardianrelation" "character varying(32)"
  "signature" "character varying(36)"
  "accountlocked" boolean [default: false]
  "bloodgroup" "character varying(32)"
  "photo" "character varying(36)"
  "identificationmark" "character varying(300)"
  "tenantid" "character varying(256)" [not null]
  "id" bigint [not null]
  "uuid" character(36)
  "accountlockeddate" bigint

Indexes {
  active [type: btree, name: "idx_eg_user_active"]
  mobilenumber [type: btree, name: "idx_eg_user_mobile"]
  name [type: btree, name: "idx_eg_user_name"]
  tenantid [type: btree, name: "idx_eg_user_tenantid"]
  type [type: btree, name: "idx_eg_user_type"]
  username [type: btree, name: "idx_eg_user_username"]
  uuid [type: btree, name: "idx_eg_user_uuid"]
}
}

Table "eg_user_address" {
  "id" bigint [not null]
  "version" numeric [default: 0]
  "createddate" timestamp [not null]
  "lastmodifieddate" timestamp
  "createdby" bigint [not null]
  "lastmodifiedby" bigint
  "type" "character varying(50)" [not null]
  "address" "character varying(440)"
  "city" "character varying(300)"
  "pincode" "character varying(10)"
  "userid" bigint [not null]
  "tenantid" "character varying(256)" [not null]

Indexes {
  tenantid [type: btree, name: "idx_eg_user_address_tenantid"]
}
}

Table "eg_user_login_failed_attempts" {
  "user_uuid" "character varying(64)" [not null]
  "ip" "character varying(46)"
  "attempt_date" bigint [not null]
  "active" boolean

Indexes {
  attempt_date [type: btree, name: "idx_eg_user_failed_attempts_user_attemptdate"]
  user_uuid [type: btree, name: "idx_eg_user_failed_attempts_user_uuid"]
}
}

Table "eg_userrole" {
  "roleid" bigint [not null]
  "roleidtenantid" "character varying(256)" [not null]
  "userid" bigint [not null]
  "tenantid" "character varying(256)" [not null]
  "lastmodifieddate" timestamp [default: `now()`]
}

Table "eg_userrole_v1" {
  "role_code" "character varying(50)"
  "role_tenantid" "character varying(256)"
  "user_id" bigint
  "user_tenantid" "character varying(256)"
  "lastmodifieddate" timestamp

Indexes {
  role_code [type: btree, name: "idx_eg_userrole_v1_rolecode"]
  role_tenantid [type: btree, name: "idx_eg_userrole_v1_roletenantid"]
  user_id [type: btree, name: "idx_eg_userrole_v1_userid"]
  user_tenantid [type: btree, name: "idx_eg_userrole_v1_usertenantid"]
}
}

Ref:"eg_user".("id", "tenantid") < "eg_user_address".("userid", "tenantid") [update: cascade, delete: cascade]

Ref:"eg_role".("id", "tenantid") < "eg_userrole".("roleid", "roleidtenantid")

Ref:"eg_user".("id", "tenantid") < "eg_userrole".("userid", "tenantid") [update: cascade, delete: cascade]

Ref:"eg_user".("id", "tenantid") < "eg_userrole_v1".("user_id", "user_tenantid")

