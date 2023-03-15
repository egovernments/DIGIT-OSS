CREATE TABLE egeis_egfStatus (
	id BIGINT NOT NULL,
	objectName CHARACTER VARYING(50) NOT NULL,
	code CHARACTER VARYING(20) NOT NULL,
	description CHARACTER VARYING(250) NOT NULL,
	tenantId CHARACTER VARYING(250) NOT NULL,
	createdby bigint,
	createddate timestamp without time zone,
	lastmodifiedby bigint,
	lastmodifieddate timestamp without time zone,
	version bigint,

	CONSTRAINT pk_egeis_egfStatus PRIMARY KEY (id)
);

CREATE SEQUENCE seq_egeis_egfStatus
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE egeis_egfConfiguration (
	id BIGINT NOT NULL,
	keyName CHARACTER VARYING(50) NOT NULL,
	description CHARACTER VARYING(250),
	createdby bigint,
	createddate timestamp without time zone,
	lastmodifiedby bigint,
	lastmodifieddate timestamp without time zone,
	version bigint,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_egfConfiguration PRIMARY KEY (Id)
);

CREATE SEQUENCE seq_egeis_egfConfiguration
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE egeis_egfConfigurationValues (
	id BIGINT NOT NULL,
	keyId BIGINT NOT NULL,
	value CHARACTER VARYING(1000) NOT NULL,
	effectiveFrom DATE NOT NULL,
	createdby bigint,
	createddate timestamp without time zone,
	lastmodifiedby bigint,
	lastmodifieddate timestamp without time zone,
	version bigint,
	tenantId CHARACTER VARYING(250) NOT NULL,

	CONSTRAINT pk_egeis_egfConfigurationValues PRIMARY KEY (Id)
);

CREATE SEQUENCE seq_egeis_egfConfigurationValues
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
