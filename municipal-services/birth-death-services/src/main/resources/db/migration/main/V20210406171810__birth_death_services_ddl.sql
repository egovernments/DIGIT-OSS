alter table eg_birth_dtls drop CONSTRAINT eg_birth_dtls_fkey1 ;
alter table eg_birth_dtls add CONSTRAINT eg_birth_dtls_fkey1 FOREIGN KEY (hospitalid)
        REFERENCES public.eg_birth_death_hospitals (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION ;
		
alter table eg_death_dtls drop CONSTRAINT eg_death_dtls_fkey1 ;
alter table eg_death_dtls add CONSTRAINT eg_death_dtls_fkey1 FOREIGN KEY (hospitalid)
        REFERENCES public.eg_birth_death_hospitals (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION ;