



Table "eg_pg_transactions" {
  "txn_id" "character varying(128)" [not null]
  "txn_amount" "numeric(15, 2)" [not null]
  "txn_status" "character varying(64)" [not null]
  "txn_status_msg" "character varying(64)"
  "gateway" "character varying(64)" [not null]
  "bill_id" "character varying(64)" [not null]
  "module" "character varying(64)"
  "module_id" "character varying(64)"
  "product_info" "character varying(512)" [not null]
  "user_uuid" "character varying(128)" [not null]
  "user_name" "character varying(128)" [not null]
  "name" "character varying(128)" [not null]
  "mobile_number" "character varying(50)"
  "email_id" "character varying(128)"
  "user_tenant_id" "character varying(128)" [not null]
  "tenant_id" "character varying(128)" [not null]
  "created_by" "character varying(64)"
  "created_time" bigint
  "last_modified_by" "character varying(64)"
  "last_modified_time" bigint
  "consumer_code" "character varying(128)"
  "additional_details" jsonb
}

Table "eg_pg_transactions_dump" {
  "txn_id" "character varying(128)" [not null]
  "txn_request" "character varying"
  "txn_response" jsonb
  "created_by" "character varying(64)"
  "created_time" bigint
  "last_modified_by" "character varying(64)"
  "last_modified_time" bigint
}



Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_blob_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_cron_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_simple_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_simprop_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_job_details".("sched_name", "job_name", "job_group") < "eg_pg_qrtz_triggers".("sched_name", "job_name", "job_group")
