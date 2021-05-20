Table "city" {
  "id" bigint [not null]
  "name" "character varying(256)" [not null]
  "localname" "character varying(256)"
  "districtcode" "character varying(10)"
  "districtname" "character varying(50)"
  "regionname" "character varying(50)"
  "longitude" double
  "latitude" double
  "tenantcode" "character varying(256)" [not null]
  "createdby" bigint
  "createddate" timestamp [default: `now()`]
  "lastmodifiedby" bigint
  "lastmodifieddate" timestamp [default: `now()`]
  "ulbgrade" "character varying(20)" [not null]
  "shapefilelocation" "character varying(100)"
  "captcha" "character varying(100)"
  "code" "character varying(20)"
}

Table "tenant" {
  "id" bigint [not null]
  "code" "character varying(256)" [not null]
  "description" "character varying(300)"
  "domainurl" "character varying(128)"
  "logoid" "character varying(36)" [not null]
  "imageid" "character varying(36)" [not null]
  "type" "character varying(35)" [not null]
  "createdby" bigint
  "createddate" timestamp [default: `now()`]
  "lastmodifiedby" bigint
  "lastmodifieddate" timestamp [default: `now()`]
  "twitterurl" "character varying(100)"
  "facebookurl" "character varying(100)"
  "emailid" "character varying(100)"
  "address" "character varying(300)"
  "contactnumber" "character varying(16)"
  "helplinenumber" "character varying(16)"
  "name" "character varying(256)"
}


Ref:"tenant"."code" < "city"."tenantcode"
