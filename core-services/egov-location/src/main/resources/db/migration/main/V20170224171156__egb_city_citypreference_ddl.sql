------------------START------------------
CREATE TABLE eg_citypreferences (
    id numeric NOT NULL,
    municipality_logo bigint,
    createdby numeric,
    lastmodifiedby numeric,
    version numeric,
    tenantid character varying(256) not null,
    municipality_name character varying(50),
    municipality_contact_no character varying(20),
    municipality_address character varying(200),
    municipality_contact_email character varying(50),
    municipality_gis_location character varying(100),
    municipality_callcenter_no character varying(20),
    municipality_facebooklink character varying(100),
    municipality_twitterlink character varying(100)
);
CREATE SEQUENCE seq_eg_citypreferences
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE eg_citypreferences ADD CONSTRAINT eg_citypreferences_pkey PRIMARY KEY (id);
ALTER TABLE eg_citypreferences ADD CONSTRAINT eg_citypreferences_id_tenant_uk unique (id,tenantid);
-------------------END-------------------

------------------START------------------
CREATE TABLE eg_city (
    domainurl character varying(128) NOT NULL,
    name character varying(256) NOT NULL,
    local_name character varying(256),
    id bigint NOT NULL,
    active boolean,
    version bigint,
    createdby numeric,
    lastmodifiedby numeric,
    code character varying(4),
    district_code character varying(10),
    district_name character varying(50),
    longitude double precision,
    latitude double precision,
    preferences numeric,
    region_name character varying(50),
    grade character varying(50),
    tenantid character varying(256) not null
);
CREATE SEQUENCE seq_eg_city
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE eg_city ADD CONSTRAINT eg_city_pkey PRIMARY KEY (id);
ALTER TABLE eg_city ADD CONSTRAINT fk_preference FOREIGN KEY (preferences) REFERENCES eg_citypreferences(id);
alter table eg_city add constraint eg_city_name_tenant_uk unique (name,tenantid);
-------------------END-------------------