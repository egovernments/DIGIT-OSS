ALTER TABLE eg_occupancy RENAME TO egbpa_occupancy;
ALTER TABLE eg_sub_occupancy RENAME TO egbpa_sub_occupancy;

ALTER SEQUENCE seq_eg_occupancy RENAME TO seq_egbpa_occupancy;
ALTER SEQUENCE seq_eg_sub_occupancy RENAME TO seq_egbpa_sub_occupancy;

truncate table egbpa_sub_occupancy cascade;
truncate table egbpa_occupancy cascade;

alter table egbpa_occupancy rename description to name;
alter table egbpa_occupancy rename additionaldescription to description;
alter table egbpa_occupancy drop constraint fk_eg_occupancy_parent;
alter table egbpa_occupancy drop parent,drop occupantDoors,drop noofOccupancy,drop occupantLoad;
alter table egbpa_occupancy rename permissibleAreaInPercentage to maxCoverage;
alter table egbpa_occupancy rename numOfTimesAreaPermissible to minFar;
alter table egbpa_occupancy rename numOfTimesAreaPermWitAddnlFee to maxFar;


alter table egbpa_sub_occupancy rename description to name;
alter table egbpa_sub_occupancy drop constraint fk_sub_occupancy_main_occ;
alter table egbpa_sub_occupancy drop occupancy,drop fromarea,drop toarea,drop condition,drop additionalcondition,drop extrainfo;
alter table egbpa_sub_occupancy add column description character varying(250);
alter table egbpa_sub_occupancy add column maxCoverage numeric;
alter table egbpa_sub_occupancy add column minFar numeric;
alter table egbpa_sub_occupancy add column maxFar numeric;
alter table egbpa_sub_occupancy add column occupancy bigint;
ALTER TABLE egbpa_sub_occupancy add FOREIGN KEY (occupancy) REFERENCES egbpa_occupancy(id);

CREATE SEQUENCE SEQ_EGBPA_USAGE;

CREATE TABLE EGBPA_USAGE (
    id bigint NOT NULL,
    code character varying(128) NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(256) NOT NULL,
    isactive boolean DEFAULT true,
    ordernumber bigint,
    version numeric DEFAULT 0,
    createdby bigint NOT NULL,
    createddate timestamp without time zone NOT NULL,
    lastmodifiedby bigint,
    lastmodifieddate timestamp without time zone,
    suboccupancy bigint not null,
    CONSTRAINT pk_EGBPA_USAGE PRIMARY KEY (id),
    CONSTRAINT unq_EGBPA_USAGE_code UNIQUE (code),
    CONSTRAINT FK_EGBPA_USAGE_MDFDBY FOREIGN KEY (lastModifiedBy) REFERENCES EG_USER (ID),
    CONSTRAINT FK_EGBPA_USAGE_CRTBY FOREIGN KEY (createdBy) REFERENCES EG_USER (ID),
    CONSTRAINT FK_EGBPA_USAGE_suboccupancy FOREIGN KEY (suboccupancy) REFERENCES egbpa_sub_occupancy (ID)
);
	
CREATE SEQUENCE SEQ_EGBPA_OCCUPANCY_MAPPING;

CREATE TABLE EGBPA_OCCUPANCY_MAPPING (
    id bigint NOT NULL,
    fromarea double precision,
    toarea double precision,
    occpancy bigint, 
    suboccupancy bigint,
    alternativeoccupancy bigint,
    alternativesuboccupancy bigint,
    CONSTRAINT pk_EGBPA_OCCUPANCY_SUBOCCUPANCY_TYPE PRIMARY KEY (id),
    CONSTRAINT FK_EGBPA_OCCUPANCY FOREIGN KEY (occpancy) REFERENCES EGBPA_OCCUPANCY (id),
    CONSTRAINT FK_EGBPA_SUBOCCUPANCY FOREIGN KEY (suboccupancy) REFERENCES EGBPA_SUB_OCCUPANCY (id),
    CONSTRAINT FK_EGBPA_ALTERNATIVE_OCCUPANCY FOREIGN KEY (alternativeoccupancy) REFERENCES EGBPA_OCCUPANCY (id),
    CONSTRAINT FK_EGBPA_ALTERNATIVE_SUBOCCUPANCY FOREIGN KEY (alternativesuboccupancy) REFERENCES EGBPA_SUB_OCCUPANCY (id)
);