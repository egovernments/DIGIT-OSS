
CREATE TABLE eg_firenoc_billingslab (
	id CHARACTER VARYING(250) NOT NULL,
	tenantid CHARACTER VARYING(250) NOT NULL,
    isactive BOOLEAN,
	firenoctype CHARACTER VARYING(250) NOT NULL,
	buildingusagetype CHARACTER VARYING(250) NOT NULL,
    calculationtype CHARACTER VARYING(250) NOT NULL,
    uom CHARACTER VARYING(250) NOT NULL,
    fromuom DOUBLE PRECISION NOT NULL,
    touom DOUBLE PRECISION NOT NULL,
    fromdate BIGINT NOT NULL,
    todate BIGINT,
    rate NUMERIC(12,2),
	createdby CHARACTER VARYING(250) NOT NULL,
	createddate BIGINT NOT NULL,
	lastmodifiedby CHARACTER VARYING(250),
	lastModifiedDate BIGINT,
	CONSTRAINT pk_egfirenoc_billingslab PRIMARY KEY (id),
	CONSTRAINT uk_egfirenoc_billingslab UNIQUE (tenantid, isactive, firenoctype, buildingusagetype, calculationtype, uom, fromuom,  touom, fromdate, todate)
);