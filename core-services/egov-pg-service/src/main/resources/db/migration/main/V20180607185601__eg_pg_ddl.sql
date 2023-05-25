DROP TABLE IF EXISTS  eg_pg_transactions;
DROP TABLE IF EXISTS  eg_pg_transactions_dump;

CREATE TABLE "eg_pg_transactions" (
	"txn_id" VARCHAR(128) NOT NULL,
	"txn_amount" NUMERIC(15,2) NOT NULL,
	"txn_status" VARCHAR(64) NOT NULL,
	"txn_status_msg"  VARCHAR(64) NOT NULL,
	"gateway" VARCHAR(64) NOT NULL,
	"bill_id" VARCHAR(64) NOT NULL,
	"module" VARCHAR(64) NOT NULL,
	"module_id" VARCHAR(64) NOT NULL,
	"product_info" VARCHAR(512) NOT NULL,
	"user_uuid" VARCHAR(128) NOT NULL,
	"user_name" VARCHAR(128) NOT NULL,
	"name" VARCHAR(128) NOT NULL,
    "mobile_number" character varying(50),
    "email_id" character varying(128),
	"user_tenant_id" VARCHAR(128) NOT NULL,
    "tenant_id" VARCHAR(128) not null,
	"gateway_txn_id" VARCHAR(128) NULL DEFAULT NULL,
	"gateway_payment_mode" VARCHAR(128) NULL DEFAULT NULL,
	"gateway_status_code" VARCHAR(128) NULL DEFAULT NULL,
	"gateway_status_msg" VARCHAR(128) NULL DEFAULT NULL,
    "receipt" VARCHAR(128) NULL DEFAULT NULL,
    "created_by" character varying(64),
    "created_time" bigint,
    "last_modified_by" character varying(64),
    "last_modified_time" bigint,
	PRIMARY KEY ("txn_id")
);

CREATE TABLE "eg_pg_transactions_dump" (
	"txn_id" VARCHAR(128) NOT NULL,
	"txn_request" varchar NULL,
	"txn_response" JSONB NULL,
    "created_by" character varying(64),
    "created_time" bigint,
    "last_modified_by" character varying(64),
    "last_modified_time" bigint,
	PRIMARY KEY ("txn_id")
);