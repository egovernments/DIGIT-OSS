
 CREATE TABLE IF NOT EXISTS state.eg_role
    (
       id bigint NOT NULL,
       name character varying(32) NOT NULL,
       description character varying(128),
       createddate timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
       createdby bigint,
       lastmodifiedby bigint,
       lastmodifieddate timestamp without time zone,
       version bigint,
       internal boolean default false,
       CONSTRAINT eg_roles_pkey PRIMARY KEY (id),
       CONSTRAINT eg_roles_role_name_key UNIQUE (name)
    );

    CREATE SEQUENCE IF NOT EXISTS state.seq_eg_role
       START WITH 1
       INCREMENT BY 1
       NO MINVALUE
       NO MAXVALUE
       CACHE 1;