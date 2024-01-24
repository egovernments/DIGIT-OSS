CREATE INDEX idx_eg_birth_dtls_hospitalid
    ON eg_birth_dtls USING btree
    (hospitalid ASC NULLS LAST) ;
    
CREATE INDEX idx_eg_death_dtls_hospitalid
    ON eg_death_dtls USING btree
    (hospitalid ASC NULLS LAST) ;
