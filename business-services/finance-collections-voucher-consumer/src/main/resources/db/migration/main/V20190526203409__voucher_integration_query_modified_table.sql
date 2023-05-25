DROP TABLE IF EXISTS egf_voucher_integration_log;

CREATE TABLE egf_voucher_integration_log(
id varchar(250),
referenceNumber varchar(50),
status varchar(20),
voucherNumber varchar(30),
type varchar(50),
description text,
requestJson JSONB,
tenantId varchar(50),
createddate TIMESTAMP not null default now()
);