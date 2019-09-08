ALTER TABLE eg_appr_bills_request
RENAME COLUMN collectionMap TO taxAndPayments;

ALTER TABLE eg_appr_bills_response
RENAME COLUMN collectionMap TO taxAndPayments;