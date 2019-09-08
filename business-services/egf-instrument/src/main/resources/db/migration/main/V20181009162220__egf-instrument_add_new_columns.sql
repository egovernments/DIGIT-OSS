ALTER TABLE egf_instrument ADD COLUMN payinSlipId varchar(256);

ALTER TABLE egf_instrument ADD COLUMN reconciledAmount numeric (13,2);

ALTER TABLE egf_instrument ADD COLUMN reconciledOn date;