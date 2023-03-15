DROP TABLE IF EXISTS eg_boundary cascade;
DROP TABLE IF EXISTS eg_boundary_type cascade;
DROP TABLE IF EXISTS eg_crosshierarchy cascade;
DROP TABLE IF EXISTS eg_feature cascade;
DROP TABLE IF EXISTS eg_feature_action cascade;
DROP TABLE IF EXISTS eg_feature_aud cascade;
DROP TABLE IF EXISTS eg_feature_role cascade;
DROP TABLE IF EXISTS eg_feature_role_aud cascade;
DROP TABLE IF EXISTS eg_hierarchy_type cascade;
DROP TABLE IF EXISTS eg_numbers cascade;
DROP TABLE IF EXISTS eg_script cascade;
DROP TABLE IF EXISTS eg_wf_action,eg_wf_additionalrule,eg_wf_amountrule,eg_wf_matrix,eg_wf_state_history,eg_wf_states,eg_wf_types cascade;
DROP TABLE IF EXISTS qrtz_blob_triggers,qrtz_calendars,qrtz_cron_triggers,qrtz_fired_triggers,qrtz_job_details,qrtz_locks,qrtz_paused_trigger_grps,qrtz_scheduler_state,qrtz_simple_triggers,qrtz_simprop_triggers,qrtz_triggers cascade;

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_filestoremap (
    id bigint NOT NULL,
    filestoreid character varying(36) NOT NULL,
    filename character varying(100) NOT NULL,
    contenttype character varying(100),
    version bigint,
    CONSTRAINT uk_filestoremap_filestoreid UNIQUE (filestoreid),
    CONSTRAINT pk_filestoremap PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_filestoremap
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_user (
    id bigint NOT NULL,
    title character varying(8),
    salutation character varying(5),
    dob timestamp without time zone,
    locale character varying(16),
    username character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    pwdexpirydate timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
    mobilenumber character varying(50),
    altcontactnumber character varying(50),
    emailid character varying(128),
    createddate timestamp without time zone,
    lastmodifieddate timestamp without time zone,
    createdby bigint,
    lastmodifiedby bigint,
    active boolean,
    name character varying(100),
    gender smallint,
    pan character varying(10),
    aadhaarnumber character varying(20),
    type character varying(50),
    version numeric DEFAULT 0,
    guardian character varying(100),
    guardianrelation character varying(32),
    CONSTRAINT eg_user_user_name_key UNIQUE (username),
    CONSTRAINT eg_user_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_user
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_module (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    enabled boolean,
    contextroot character varying(10),
    parentmodule bigint,
    displayname character varying(50),
    ordernumber bigint,
    CONSTRAINT eg_module_module_name_key UNIQUE (name),
    CONSTRAINT eg_module_pkey PRIMARY KEY (id),
    CONSTRAINT fk_eg_module_parentmodule FOREIGN KEY (parentmodule)
      REFERENCES eg_module (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_module
    START WITH 300
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START-------------------
CREATE TABLE IF NOT EXISTS eg_action (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    url character varying(150),
    queryparams character varying(150),
    parentmodule bigint NOT NULL,
    ordernumber bigint,
    displayname character varying(80),
    enabled boolean,
    contextroot character varying(32),
    version numeric DEFAULT 0,
    createdby numeric DEFAULT 1,
    createddate timestamp without time zone DEFAULT now(),
    lastmodifiedby numeric DEFAULT 1,
    lastmodifieddate timestamp without time zone DEFAULT now(),
    application bigint NOT NULL,
    CONSTRAINT eg_action_url_queryparams_context_root_key UNIQUE (url, queryparams, contextroot),
    CONSTRAINT eg_action_pkey PRIMARY KEY (id),
    CONSTRAINT fk_eg_action_parentmodule FOREIGN KEY (parentmodule)
      REFERENCES eg_module (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_action
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_address (
    housenobldgapt character varying(32),
    subdistrict character varying(100),
    postoffice character varying(100),
    landmark character varying(256),
    country character varying(50),
    userid bigint,
    type character varying(50),
    streetroadline character varying(256),
    citytownvillage character varying(256),
    arealocalitysector character varying(256),
    district character varying(100),
    state character varying(100),
    pincode character varying(10),
    id numeric NOT NULL,
    version bigint DEFAULT 0,
    CONSTRAINT eg_address_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_address
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_appconfig (
    id bigint NOT NULL,
    key_name character varying(250) NOT NULL,
    description character varying(250) NOT NULL,
    version bigint,
    createdby bigint,
    lastmodifiedby bigint,
    createddate timestamp without time zone,
    lastmodifieddate timestamp without time zone,
    module bigint NOT NULL,
    CONSTRAINT uk_keyname_module_unique UNIQUE (key_name, module),
    CONSTRAINT eg_appconfig_pkey PRIMARY KEY (id),
    CONSTRAINT fk_eg_appconfig_moduleid FOREIGN KEY (module)
      REFERENCES eg_module (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_appconfig
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_appconfig_values (
    id bigint NOT NULL,
    key_id bigint NOT NULL,
    effective_from timestamp without time zone NOT NULL,
    value character varying(4000) NOT NULL,
    createddate timestamp without time zone,
    lastmodifieddate timestamp without time zone,
    createdby bigint,
    lastmodifiedby bigint,
    version bigint,
    CONSTRAINT eg_appconfig_values_pkey PRIMARY KEY (id),
    CONSTRAINT fk_appdata_key FOREIGN KEY (key_id)
      REFERENCES eg_appconfig (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_appconfig_values
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_applicationindex (
    id bigint NOT NULL,
    modulename character varying(50) NOT NULL,
    applicationnumber character varying(50) NOT NULL,
    applicationdate date NOT NULL,
    applicationtype character varying(150) NOT NULL,
    applicantname character varying(100) NOT NULL,
    applicantaddress character varying(250),
    disposaldate date,
    ulbname character varying(250) NOT NULL,
    districtname character varying(250),
    status character varying(50) NOT NULL,
    url character varying(250) NOT NULL,
    consumercode character varying(50),
    mobilenumber character varying(15),
    createdby bigint NOT NULL,
    createddate timestamp without time zone NOT NULL,
    lastmodifieddate timestamp without time zone NOT NULL,
    lastmodifiedby bigint NOT NULL,
    version numeric NOT NULL,
    CONSTRAINT eg_applicationindex_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_applicationindex
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_citypreferences (
    id numeric NOT NULL,
    giskml bigint,
    municipalitylogo bigint,
    createdby numeric,
    createddate timestamp without time zone,
    lastmodifiedby numeric,
    lastmodifieddate timestamp without time zone,
    version numeric,
    municipalityname character varying(50),
    municipalitycontactno character varying(20),
    municipalityaddress character varying(200),
    municipalitycontactemail character varying(50),
    municipalitygislocation character varying(100),
    municipalitycallcenterno character varying(20),
    municipalityfacebooklink character varying(100),
    municipalitytwitterlink character varying(100),
    CONSTRAINT eg_citypreferences_pkey PRIMARY KEY (id),
    CONSTRAINT eg_citypreferences_giskml_fkey FOREIGN KEY (giskml)
      REFERENCES eg_filestoremap (id),
    CONSTRAINT eg_citypreferences_logo_fkey FOREIGN KEY (municipalitylogo)
      REFERENCES eg_filestoremap (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_citypreferences
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_city (
    domainurl character varying(128) NOT NULL,
    name character varying(256) NOT NULL,
    localname character varying(256),
    id bigint NOT NULL,
    active boolean,
    version bigint,
    createdby numeric,
    lastmodifiedby numeric,
    createddate timestamp without time zone,
    lastmodifieddate timestamp without time zone,
    code character varying(4),
    recaptchapk character varying(64),
    districtcode character varying(10),
    districtname character varying(50),
    longitude double precision,
    latitude double precision,
    preferences numeric,
    recaptchapub character varying(64),
    CONSTRAINT eg_city_pkey PRIMARY KEY (id),
    CONSTRAINT fk_preference FOREIGN KEY (preferences)
      REFERENCES eg_citypreferences (id) MATCH FULL
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_city
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_city_aud (
    id integer NOT NULL,
    rev integer NOT NULL,
    name character varying(256),
    localname character varying(256),
    active boolean,
    domainurl character varying(128),
    recaptchapk character varying(64),
    recaptchapub character varying(64),
    code character varying(4),
    districtcode character varying(10),
    districtname character varying(50),
    longitude double precision,
    latitude double precision,
    revtype numeric,
    CONSTRAINT eg_city_aud_pkey PRIMARY KEY (id, rev)
);
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_correspondence_address (
    id numeric,
    version numeric DEFAULT 0
);
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_device (
    id bigint NOT NULL,
    deviceuid character varying(128) NOT NULL,
    type character varying(32) NOT NULL,
    osversion character varying(32),
    createddate timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
    createdby bigint,
    lastmodifiedby bigint,
    lastmodifieddate timestamp without time zone,
    version bigint,
    CONSTRAINT eg_device_device_id_key UNIQUE (deviceuid),
    CONSTRAINT eg_device_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_device
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_favourites (
    id bigint NOT NULL,
    userid bigint,
    actionid bigint,
    name character varying(100),
    contextroot character varying(50),
    version bigint,
    CONSTRAINT eg_favourites_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_favourites
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_identityrecovery (
    id numeric NOT NULL,
    token character varying(36),
    userid bigint,
    expiry timestamp without time zone,
    version bigint,
    CONSTRAINT eg_identityrecovery_token_key UNIQUE (token),
    CONSTRAINT eg_identityrecovery_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_identityrecovery
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_messagetemplate (
    id numeric NOT NULL,
    templatename character varying(100) NOT NULL,
    template character varying NOT NULL,
    locale character varying(10),
    version bigint,
    CONSTRAINT eg_messagetemplate_templatename_key UNIQUE (templatename),
    CONSTRAINT eg_messagetemplate_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_messagetemplate
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_permanent_address (
    id numeric,
    version numeric DEFAULT 0
);
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_role (
    id bigint NOT NULL,
    name character varying(32) NOT NULL,
    description character varying(128),
    createddate timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
    createdby bigint,
    lastmodifiedby bigint,
    lastmodifieddate timestamp without time zone,
    version bigint,
    CONSTRAINT eg_roles_role_name_key UNIQUE (name),
    CONSTRAINT eg_roles_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_role
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_roleaction (
    roleid bigint NOT NULL,
    actionid bigint NOT NULL,
    CONSTRAINT fk_action_id FOREIGN KEY (actionid)
      REFERENCES eg_action (id),
    CONSTRAINT fk_role_id FOREIGN KEY (roleid)
      REFERENCES eg_role (id)
);
CREATE INDEX IF NOT EXISTS indx_eram_actionid ON eg_roleaction USING btree (actionid);
CREATE INDEX IF NOT EXISTS indx_eram_roleid ON eg_roleaction USING btree (roleid);
-------------------END-------------------
DROP TABLE IF EXISTS eg_loginaudit;
DROP SEQUENCE IF EXISTS seq_eg_loginaudit;
------------------START------------------
CREATE TABLE IF NOT EXISTS eg_systemaudit (
    id numeric NOT NULL,
    userid bigint,
    ipaddress character varying(20),
    useragentinfo character varying(200),
    logintime timestamp without time zone,
    logouttime timestamp without time zone,
    version numeric,
    CONSTRAINT eg_systemaudit_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_systemaudit
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_token (
    id bigint NOT NULL,
    tokennumber character varying(128) NOT NULL,
    tokenidentity character varying(100),
    service character varying(100),
    ttlsecs bigint NOT NULL,
    createddate timestamp without time zone NOT NULL,
    lastmodifieddate timestamp without time zone,
    createdby bigint NOT NULL,
    lastmodifiedby bigint,
    version bigint,
    CONSTRAINT pk_token PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_token
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE INDEX IF NOT EXISTS idx_token_number ON eg_token USING btree (tokennumber);
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_userdevice (
    userid bigint NOT NULL,
    deviceid bigint NOT NULL,
    createddate timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
    CONSTRAINT fk_user_userdevice FOREIGN KEY (userid)
      REFERENCES eg_user (id),
    CONSTRAINT fk_userdevice FOREIGN KEY (deviceid)
      REFERENCES eg_device (id)
);

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_userrole (
    roleid bigint NOT NULL,
    userid bigint NOT NULL,
    CONSTRAINT fk_role_userrole FOREIGN KEY (roleid)
      REFERENCES eg_role (id),
    CONSTRAINT fk_user_userrole FOREIGN KEY (userid)
      REFERENCES eg_user (id)
);

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS revinfo (
    id integer NOT NULL,
    "timestamp" bigint,
    userid bigint,
    ipaddress character varying(20),
    CONSTRAINT revinfo_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS revinfo_rev_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS hibernate_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE revinfo_rev_seq OWNED BY revinfo.id;
ALTER TABLE ONLY revinfo ALTER COLUMN id SET DEFAULT nextval('revinfo_rev_seq'::regclass);
-------------------END-------------------

------------------START------------------
CREATE VIEW view_eg_menulink AS
 SELECT m.id AS module_id,
    m.displayname AS module_name,
    m.parentmodule AS parent_id,
    NULL::bigint AS action_id,
    NULL::character varying AS action_name,
    NULL::text AS action_url,
    m.ordernumber AS order_number,
    'M'::text AS typeflag,
    m.enabled AS is_enabled,
    NULL::character varying AS context_root
   FROM eg_module m
UNION
 SELECT NULL::bigint AS module_id,
    NULL::character varying AS module_name,
    a.parentmodule AS parent_id,
    a.id AS action_id,
    a.displayname AS action_name,
    ((a.url)::text ||
        CASE
            WHEN (a.queryparams IS NULL) THEN ''::text
            ELSE ('?'::text || (a.queryparams)::text)
        END) AS action_url,
    a.ordernumber AS order_number,
    'A'::text AS typeflag,
    a.enabled AS is_enabled,
    a.contextroot AS context_root
   FROM eg_action a;
