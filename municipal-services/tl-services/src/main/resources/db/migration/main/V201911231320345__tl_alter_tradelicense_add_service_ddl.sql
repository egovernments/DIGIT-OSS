ALTER TABLE eg_tl_tradelicense
ADD COLUMN businessservice character varying(64);
ALTER TABLE eg_tl_tradelicense_audit
ADD COLUMN businessservice character varying(64);