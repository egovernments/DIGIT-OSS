CREATE TABLE public.eg_birth_death_hospitals
(
    id character varying(64)  NOT NULL,
    hospitalname character varying(500)  NOT NULL,
    tenantid character varying(50)  NOT NULL,
    CONSTRAINT eg_birth_death_hospitals_pkey PRIMARY KEY (id)
);

CREATE SEQUENCE public.seq_eg_bnd_br_apl
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE public.eg_birth_dtls
(
    id character varying(64)  NOT NULL,
    registrationno character varying(64)  NOT NULL,
    hospitalname character varying(500) ,
    dateofreport timestamp without time zone,
    dateofbirth timestamp without time zone NOT NULL,
    firstname character varying(200) ,
    middlename character varying(200) ,
    lastname character varying(200) ,
    placeofbirth character varying(1000) ,
    informantsname character varying(200) ,
    informantsaddress character varying(1000) ,
    createdtime bigint,
    createdby character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    counter smallint,
    tenantid character varying(50)  NOT NULL,
    gender smallint NOT NULL,
    remarks character varying(1000) ,
    hospitalid character varying(64) ,
    CONSTRAINT eg_birth_dtls_pkey PRIMARY KEY (id),
    CONSTRAINT eg_birth_dtls_ukey1 UNIQUE (registrationno, tenantid),
    CONSTRAINT eg_birth_dtls_fkey1 FOREIGN KEY (hospitalid)
        REFERENCES public.eg_birth_death_hospitals (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.eg_birth_father_info
(
    id character varying(64)  NOT NULL,
    firstname character varying(200) ,
    middlename character varying(200) ,
    lastname character varying(200) ,
    aadharno character varying(150) ,
    emailid character varying(300) ,
    mobileno character varying(150) ,
    education character varying(100) ,
    proffession character varying(100) ,
    nationality character varying(100) ,
    religion character varying(100) ,
    createdtime bigint,
    createdby character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    birthdtlid character varying(64)  NOT NULL,
    CONSTRAINT eg_birth_father_info_pkey PRIMARY KEY (id),
    CONSTRAINT eg_birth_father_info_fkey1 FOREIGN KEY (birthdtlid)
        REFERENCES public.eg_birth_dtls (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.eg_birth_mother_info
(
    id character varying(64)  NOT NULL,
    firstname character varying(200) ,
    middlename character varying(200) ,
    lastname character varying(200) ,
    aadharno character varying(150) ,
    emailid character varying(300) ,
    mobileno character varying(150) ,
    education character varying(100) ,
    proffession character varying(100) ,
    nationality character varying(100) ,
    religion character varying(100) ,
    createdtime bigint,
    createdby character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    birthdtlid character varying(64)  NOT NULL,
    CONSTRAINT eg_birth_mother_info_pkey PRIMARY KEY (id),
    CONSTRAINT eg_birth_mother_info_fkey1 FOREIGN KEY (birthdtlid)
        REFERENCES public.eg_birth_dtls (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.eg_birth_permaddr
(
    id character varying(64)  NOT NULL,
    buildingno character varying(1000) ,
    houseno character varying(1000) ,
    streetname character varying(1000) ,
    locality character varying(1000) ,
    tehsil character varying(1000) ,
    district character varying(100) ,
    city character varying(100) ,
    state character varying(100) ,
    pinno character varying(100) ,
    country character varying(100) ,
    createdby character varying(64) ,
    createdtime bigint,
    lastmodifiedby character varying(64) ,
    lastmodifiedtime bigint,
    birthdtlid character varying(64) ,
    CONSTRAINT eg_birth_permaddr_pkey PRIMARY KEY (id),
    CONSTRAINT eg_birth_permaddr_fkey1 FOREIGN KEY (birthdtlid)
        REFERENCES public.eg_birth_dtls (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.eg_birth_presentaddr
(
    id character varying(64)  NOT NULL,
    buildingno character varying(1000) ,
    houseno character varying(1000) ,
    streetname character varying(1000) ,
    locality character varying(1000) ,
    tehsil character varying(1000) ,
    district character varying(100) ,
    city character varying(100) ,
    state character varying(100) ,
    pinno character varying(100) ,
    country character varying(100) ,
    createdby character varying(64) ,
    createdtime bigint,
    lastmodifiedby character varying(64) ,
    lastmodifiedtime bigint,
    birthdtlid character varying(64) ,
    CONSTRAINT eg_birth_presentaddr_pkey PRIMARY KEY (id),
    CONSTRAINT eg_birth_presentaddr_fkey1 FOREIGN KEY (birthdtlid)
        REFERENCES public.eg_birth_dtls (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.eg_birth_cert_request
(
    id character varying(64)  NOT NULL,
    birthcertificateno character varying(25) ,
    createdby character varying(64) ,
    createdtime bigint,
    birthdtlid character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    filestoreid character varying(256) ,
    status character varying(25) ,
    additionaldetail jsonb,
    embeddedurl character varying(64) ,
    dateofissue bigint,
    CONSTRAINT eg_birth_cert_request_pkey PRIMARY KEY (id),
    CONSTRAINT eg_birth_cert_request_fkey1 FOREIGN KEY (birthdtlid)
        REFERENCES public.eg_birth_dtls (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.eg_birth_cert_request_audit
(
    id character varying(64)  NOT NULL,
    birthcertificateno character varying(25) ,
    createdby character varying(64) ,
    createdtime bigint,
    birthdtlid character varying(64) ,
    lastmodifiedtime bigint,
    lastmodifiedby character varying(64) ,
    filestoreid character varying(256) ,
    status character varying(25) ,
    additionaldetail jsonb,
    embeddedurl character varying(64) ,
    dateofissue bigint
);