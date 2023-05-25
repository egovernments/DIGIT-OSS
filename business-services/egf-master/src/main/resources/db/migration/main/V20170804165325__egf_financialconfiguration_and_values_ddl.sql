 drop table if exists egeis_egfConfiguration ;
 drop sequence if exists seq_egeis_egfConfiguration ;
 drop table if exists egeis_egfConfigurationValues ;
 drop sequence if exists seq_egeis_egfConfigurationValues ;

CREATE TABLE egf_financialconfiguration (
	id CHARACTER VARYING(250) NOT NULL,
	keyName CHARACTER VARYING(50) NOT NULL,
	description CHARACTER VARYING(250),
	module CHARACTER VARYING(50),
	createdby bigint,
	createddate timestamp without time zone,
	lastmodifiedby bigint,
	lastmodifieddate timestamp without time zone,
	version bigint,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egf_financialconfiguration PRIMARY KEY (Id)
);

CREATE SEQUENCE seq_egf_financialconfiguration
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE egf_financialconfigurationvalues (
	id CHARACTER VARYING(250) NOT NULL,
	keyId CHARACTER VARYING(250) NOT NULL,
	value CHARACTER VARYING(1000) NOT NULL,
	effectiveFrom DATE NOT NULL,
	createdby bigint,
	createddate timestamp without time zone,
	lastmodifiedby bigint,
	lastmodifieddate timestamp without time zone,
	version bigint,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egf_financialconfigurationvalues PRIMARY KEY (Id)
);

CREATE SEQUENCE seq_egf_financialconfigurationvalues
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

