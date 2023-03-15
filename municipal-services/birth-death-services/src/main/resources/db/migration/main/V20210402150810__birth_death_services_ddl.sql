ALTER TABLE public.eg_birth_permaddr
    ALTER COLUMN birthdtlid SET NOT NULL;
	
ALTER TABLE public.eg_birth_presentaddr
    ALTER COLUMN birthdtlid SET NOT NULL;
	
ALTER TABLE public.eg_birth_cert_request
    ALTER COLUMN birthdtlid SET NOT NULL;
	
ALTER TABLE public.eg_death_permaddr
    ALTER COLUMN deathdtlid SET NOT NULL;
	
ALTER TABLE public.eg_death_presentaddr
    ALTER COLUMN deathdtlid SET NOT NULL;
	
ALTER TABLE public.eg_death_spouse_info
    ALTER COLUMN deathdtlid SET NOT NULL;
	
ALTER TABLE public.eg_death_cert_request
    ALTER COLUMN deathdtlid SET NOT NULL;