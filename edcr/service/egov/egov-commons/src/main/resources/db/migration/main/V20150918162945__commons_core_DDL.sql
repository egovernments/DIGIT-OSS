DROP TABLE IF EXISTS vouchermis cascade;
DROP TABLE IF EXISTS voucherheader cascade;
DROP TABLE IF EXISTS supplier cascade;
DROP TABLE IF EXISTS sub_scheme cascade;
DROP TABLE IF EXISTS scheme cascade;
DROP TABLE IF EXISTS accountdetailkey cascade;
DROP TABLE IF EXISTS accountdetailtype cascade;
DROP TABLE IF EXISTS accountdetailtype_aud cascade;
DROP TABLE IF EXISTS accountentitymaster cascade;
DROP TABLE IF EXISTS bank cascade;
DROP TABLE IF EXISTS bankaccount cascade;
DROP TABLE IF EXISTS bankbranch cascade;
DROP TABLE IF EXISTS bankreconciliation cascade;
DROP TABLE IF EXISTS chartofaccountdetail cascade;
DROP TABLE IF EXISTS chartofaccountdetail_aud cascade;
DROP TABLE IF EXISTS chartofaccounts cascade;
DROP TABLE IF EXISTS chartofaccounts_aud cascade;
DROP TABLE IF EXISTS eg_authorization_rule cascade;
DROP TABLE IF EXISTS eg_chairperson cascade;
DROP TABLE IF EXISTS eg_checklist cascade;
DROP TABLE IF EXISTS eg_checklist_type cascade;
DROP TABLE IF EXISTS eg_checklists cascade;
DROP TABLE IF EXISTS eg_department cascade;
DROP TABLE IF EXISTS eg_designation cascade;
DROP TABLE IF EXISTS eg_drawingofficer cascade;
DROP TABLE IF EXISTS eg_nationality cascade;
DROP TABLE IF EXISTS eg_notification_group cascade;
DROP TABLE IF EXISTS eg_partytype cascade;
DROP TABLE IF EXISTS eg_position cascade;
DROP TABLE IF EXISTS eg_regionalheirarchy cascade;
DROP TABLE IF EXISTS eg_surrendered_cheques cascade;
DROP TABLE IF EXISTS eg_uomcategory,eg_uom cascade;
DROP TABLE IF EXISTS egeis_deptdesig cascade;
DROP TABLE IF EXISTS egw_contractor_grade cascade;
DROP TABLE IF EXISTS egw_status,egw_typeofwork cascade;
DROP TABLE IF EXISTS financialyear,fiscalperiod,financial_institution cascade;
DROP TABLE IF EXISTS function,functionary,fund,fundsource,generalledger,generalledgerdetail cascade;
DROP TABLE IF EXISTS eg_location,eg_location_ipmap,eg_usercounter_map,eg_modules cascade;

DROP SEQUENCE IF EXISTS seq_financialyear,seq_fiscalperiod;

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_location (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(100),
    version numeric,
    createdby bigint,
    createddate timestamp without time zone,
    lastModifiedBy bigint,
    lastmodifieddate timestamp without time zone,
    active boolean,
    CONSTRAINT eg_location_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_location
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_location_ipmap (
    id bigint NOT NULL,
    locationid bigint NOT NULL,
    ipaddress character varying(150) NOT NULL,
    CONSTRAINT eg_location_ipmap_ipaddress_key UNIQUE (ipaddress),
    CONSTRAINT eg_location_ipmap_pkey PRIMARY KEY (id),
    CONSTRAINT fk_location_id FOREIGN KEY (locationid)
      REFERENCES eg_location (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_location_ipmap
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_usercounter_map (
    id bigint NOT NULL,
    userid bigint NOT NULL,
    counterid bigint NOT NULL,
    fromdate timestamp without time zone NOT NULL,
    todate timestamp without time zone,
    version numeric,
    createdby bigint,
    createddate timestamp without time zone,
    lastModifiedBy bigint,
    lastmodifieddate timestamp without time zone,
    CONSTRAINT eg_usercounter_map_pkey PRIMARY KEY (id),
    CONSTRAINT fk_mapcounterid FOREIGN KEY (counterid)
      REFERENCES eg_location (id),
    CONSTRAINT fk_mapuserid FOREIGN KEY (userid)
      REFERENCES eg_user (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_usercounter_map
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE INDEX IF NOT EXISTS indx_eucm_counterid ON eg_usercounter_map USING btree (counterid);
CREATE INDEX IF NOT EXISTS indx_eucm_userid ON eg_usercounter_map USING btree (userid);
-------------------END-------------------

------------------START------------------
CREATE TABLE IF NOT EXISTS eg_modules (
    id bigint NOT NULL,
    name character varying(30) NOT NULL,
    description character varying(250),
   CONSTRAINT eg_modules_pkey PRIMARY KEY (id)
);
CREATE SEQUENCE IF NOT EXISTS seq_eg_modules
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
-------------------END-------------------