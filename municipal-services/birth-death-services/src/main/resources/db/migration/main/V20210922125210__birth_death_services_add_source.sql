ALTER TABLE public.eg_birth_cert_request ADD COLUMN source character varying(64) ;

ALTER TABLE public.eg_birth_cert_request_audit ADD COLUMN source character varying(64) ;

ALTER TABLE public.eg_death_cert_request ADD COLUMN source character varying(64) ;

ALTER TABLE public.eg_death_cert_request_audit ADD COLUMN source character varying(64) ;