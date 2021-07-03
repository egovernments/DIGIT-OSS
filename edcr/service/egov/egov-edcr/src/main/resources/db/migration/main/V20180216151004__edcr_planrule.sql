--Dropping old structure
DROP TABLE IF EXISTS EDCR_PLANRULE;

DROP SEQUENCE IF EXISTS SEQ_EDCR_PLANRULE;

--PLANRULE TABLE
CREATE TABLE EDCR_PLANRULE(
 id bigint NOT NULL,
 service character varying(128),
 minplotArea bigint,
 maxplotArea bigint,
 occupancy character varying(256),
 minfloors bigint,
 maxfloors bigint,
 minbuildinghgt bigint,
 maxbuildinghgt bigint,
 familysize character varying(256),
 abutingroad character varying(256),
 roadmin bigint,
 roadmax bigint,
 active boolean default true NOT NULL,
 rules character varying(1024),
 version numeric default 0,
 createdBy bigint NOT NULL,
 createdDate timestamp without time zone NOT NULL,
 lastModifiedBy bigint,
 lastModifiedDate timestamp without time zone,
 CONSTRAINT PK_EDCR_PLANRULE PRIMARY KEY (id),
 CONSTRAINT FK_EDCR_PLANRULE_MDFDBY FOREIGN KEY (lastModifiedBy)
 REFERENCES EG_USER (ID),
 CONSTRAINT FK_EDCR_PLANRULE_CRTBY FOREIGN KEY (createdBy)
 REFERENCES EG_USER (ID)
);

CREATE SEQUENCE SEQ_EDCR_PLANRULE;