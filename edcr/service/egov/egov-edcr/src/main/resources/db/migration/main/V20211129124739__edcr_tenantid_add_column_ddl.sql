alter table edcr_application add column tenantId character varying(64);

alter table edcr_application_detail add column tenantId character varying(64);

alter table edcr_pdf_detail add column tenantId character varying(64);