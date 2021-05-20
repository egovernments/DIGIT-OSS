Table "eg_pg_qrtz_blob_triggers" {
  "sched_name" "character varying(120)" [not null]
  "trigger_name" "character varying(200)" [not null]
  "trigger_group" "character varying(200)" [not null]
  "blob_data" bytea
}

Table "eg_pg_qrtz_calendars" {
  "sched_name" "character varying(120)" [not null]
  "calendar_name" "character varying(200)" [not null]
  "calendar" bytea [not null]
}

Table "eg_pg_qrtz_cron_triggers" {
  "sched_name" "character varying(120)" [not null]
  "trigger_name" "character varying(200)" [not null]
  "trigger_group" "character varying(200)" [not null]
  "cron_expression" "character varying(120)" [not null]
  "time_zone_id" "character varying(80)"
}

Table "eg_pg_qrtz_fired_triggers" {
  "sched_name" "character varying(120)" [not null]
  "entry_id" "character varying(95)" [not null]
  "trigger_name" "character varying(200)" [not null]
  "trigger_group" "character varying(200)" [not null]
  "instance_name" "character varying(200)" [not null]
  "fired_time" bigint [not null]
  "sched_time" bigint [not null]
  "priority" integer [not null]
  "state" "character varying(16)" [not null]
  "job_name" "character varying(200)"
  "job_group" "character varying(200)"
  "is_nonconcurrent" boolean
  "requests_recovery" boolean

Indexes {
  (sched_name, instance_name, requests_recovery) [type: btree, name: "idx_eg_pg_qrtz_ft_inst_job_req_rcvry"]
  (sched_name, job_name, job_group) [type: btree, name: "idx_eg_pg_qrtz_ft_j_g"]
  (sched_name, job_group) [type: btree, name: "idx_eg_pg_qrtz_ft_jg"]
  (sched_name, trigger_name, trigger_group) [type: btree, name: "idx_eg_pg_qrtz_ft_t_g"]
  (sched_name, trigger_group) [type: btree, name: "idx_eg_pg_qrtz_ft_tg"]
  (sched_name, instance_name) [type: btree, name: "idx_eg_pg_qrtz_ft_trig_inst_name"]
}
}

Table "eg_pg_qrtz_job_details" {
  "sched_name" "character varying(120)" [not null]
  "job_name" "character varying(200)" [not null]
  "job_group" "character varying(200)" [not null]
  "description" "character varying(250)"
  "job_class_name" "character varying(250)" [not null]
  "is_durable" boolean [not null]
  "is_nonconcurrent" boolean [not null]
  "is_update_data" boolean [not null]
  "requests_recovery" boolean [not null]
  "job_data" bytea

Indexes {
  (sched_name, job_group) [type: btree, name: "idx_eg_pg_qrtz_j_grp"]
  (sched_name, requests_recovery) [type: btree, name: "idx_eg_pg_qrtz_j_req_recovery"]
}
}

Table "eg_pg_qrtz_locks" {
  "sched_name" "character varying(120)" [not null]
  "lock_name" "character varying(40)" [not null]
}

Table "eg_pg_qrtz_paused_trigger_grps" {
  "sched_name" "character varying(120)" [not null]
  "trigger_group" "character varying(200)" [not null]
}

Table "eg_pg_qrtz_scheduler_state" {
  "sched_name" "character varying(120)" [not null]
  "instance_name" "character varying(200)" [not null]
  "last_checkin_time" bigint [not null]
  "checkin_interval" bigint [not null]
}

Table "eg_pg_qrtz_simple_triggers" {
  "sched_name" "character varying(120)" [not null]
  "trigger_name" "character varying(200)" [not null]
  "trigger_group" "character varying(200)" [not null]
  "repeat_count" bigint [not null]
  "repeat_interval" bigint [not null]
  "times_triggered" bigint [not null]
}

Table "eg_pg_qrtz_simprop_triggers" {
  "sched_name" "character varying(120)" [not null]
  "trigger_name" "character varying(200)" [not null]
  "trigger_group" "character varying(200)" [not null]
  "str_prop_1" "character varying(512)"
  "str_prop_2" "character varying(512)"
  "str_prop_3" "character varying(512)"
  "int_prop_1" integer
  "int_prop_2" integer
  "long_prop_1" bigint
  "long_prop_2" bigint
  "dec_prop_1" "numeric(13, 4)"
  "dec_prop_2" "numeric(13, 4)"
  "bool_prop_1" boolean
  "bool_prop_2" boolean
}

Table "eg_pg_qrtz_triggers" {
  "sched_name" "character varying(120)" [not null]
  "trigger_name" "character varying(200)" [not null]
  "trigger_group" "character varying(200)" [not null]
  "job_name" "character varying(200)" [not null]
  "job_group" "character varying(200)" [not null]
  "description" "character varying(250)"
  "next_fire_time" bigint
  "prev_fire_time" bigint
  "priority" integer
  "trigger_state" "character varying(16)" [not null]
  "trigger_type" "character varying(8)" [not null]
  "start_time" bigint [not null]
  "end_time" bigint
  "calendar_name" "character varying(200)"
  "misfire_instr" smallint
  "job_data" bytea

Indexes {
  (sched_name, calendar_name) [type: btree, name: "idx_eg_pg_qrtz_t_c"]
  (sched_name, trigger_group) [type: btree, name: "idx_eg_pg_qrtz_t_g"]
  (sched_name, job_name, job_group) [type: btree, name: "idx_eg_pg_qrtz_t_j"]
  (sched_name, job_group) [type: btree, name: "idx_eg_pg_qrtz_t_jg"]
  (sched_name, trigger_group, trigger_state) [type: btree, name: "idx_eg_pg_qrtz_t_n_g_state"]
  (sched_name, trigger_name, trigger_group, trigger_state) [type: btree, name: "idx_eg_pg_qrtz_t_n_state"]
  (sched_name, next_fire_time) [type: btree, name: "idx_eg_pg_qrtz_t_next_fire_time"]
  (sched_name, misfire_instr, next_fire_time) [type: btree, name: "idx_eg_pg_qrtz_t_nft_misfire"]
  (sched_name, trigger_state, next_fire_time) [type: btree, name: "idx_eg_pg_qrtz_t_nft_st"]
  (sched_name, misfire_instr, next_fire_time, trigger_state) [type: btree, name: "idx_eg_pg_qrtz_t_nft_st_misfire"]
  (sched_name, misfire_instr, next_fire_time, trigger_group, trigger_state) [type: btree, name: "idx_eg_pg_qrtz_t_nft_st_misfire_grp"]
  (sched_name, trigger_state) [type: btree, name: "idx_eg_pg_qrtz_t_state"]
}
}

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

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_blob_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_cron_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_simple_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_triggers".("sched_name", "trigger_name", "trigger_group") < "eg_pg_qrtz_simprop_triggers".("sched_name", "trigger_name", "trigger_group")

Ref:"eg_pg_qrtz_job_details".("sched_name", "job_name", "job_group") < "eg_pg_qrtz_triggers".("sched_name", "job_name", "job_group")
