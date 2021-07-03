--RULE TABLE
CREATE TABLE EDCR_RULE(
 id bigint NOT NULL,
 name character varying(128) NOT NULL,
 clause character varying(256) NOT NULL,
 active boolean DEFAULT true NOT NULL,
 version numeric DEFAULT 0,
 createdBy bigint NOT NULL,
 createdDate timestamp without time zone NOT NULL,
 lastModifiedBy bigint,
 lastModifiedDate timestamp without time zone,
 CONSTRAINT PK_EDCR_RULE PRIMARY KEY (id),
 CONSTRAINT FK_EDCR_RULE_MDFDBY FOREIGN KEY (lastModifiedBy)
 REFERENCES EG_USER (ID),
 CONSTRAINT FK_EDCR_RULE_CRTBY FOREIGN KEY (createdBy)
 REFERENCES EG_USER (ID)
);

CREATE SEQUENCE SEQ_EDCR_RULE;


--SUBRULE TABLE
CREATE TABLE EDCR_SUBRULE(
 id bigint NOT NULL,
 name character varying(128) NOT NULL,
 rule bigint NOT NULL,
 clause character varying(256) NOT NULL,
 active boolean DEFAULT true NOT NULL,
 orderby bigint,
 version numeric DEFAULT 0,
 createdBy bigint NOT NULL,
 createdDate timestamp without time zone NOT NULL,
 lastModifiedBy bigint,
 lastModifiedDate timestamp without time zone,
 CONSTRAINT PK_EDCR_SUBRULE PRIMARY KEY (id),
 CONSTRAINT FK_EDCR_SUBRULE_RULE FOREIGN KEY (rule) REFERENCES EDCR_RULE (id),
 CONSTRAINT FK_EDCR_SUBRULE_MDFDBY FOREIGN KEY (lastModifiedBy)
 REFERENCES EG_USER (ID),
 CONSTRAINT FK_EDCR_SUBRULE_CRTBY FOREIGN KEY (createdBy)
 REFERENCES EG_USER (ID)
);

CREATE SEQUENCE SEQ_EDCR_SUBRULE;

--PLANRULE TABLE
CREATE TABLE EDCR_PLANRULE(
 id bigint NOT NULL,
 service character varying(128),
 plotArea bigint,
 occupancy character varying(256),
 nooffloors bigint,
 heightofbuilding bigint,
 active boolean DEFAULT true NOT NULL,
 rule bigint,
 version numeric DEFAULT 0,
 createdBy bigint NOT NULL,
 createdDate timestamp without time zone NOT NULL,
 lastModifiedBy bigint,
 lastModifiedDate timestamp without time zone,
 CONSTRAINT PK_EDCR_PLANRULE PRIMARY KEY (id),
 CONSTRAINT FK_EDCR_PLANRULE_RULE FOREIGN KEY (rule) REFERENCES EDCR_RULE (id),
 CONSTRAINT FK_EDCR_PLANRULE_MDFDBY FOREIGN KEY (lastModifiedBy)
 REFERENCES EG_USER (ID),
 CONSTRAINT FK_EDCR_PLANRULE_CRTBY FOREIGN KEY (createdBy)
 REFERENCES EG_USER (ID)
);

CREATE SEQUENCE SEQ_EDCR_PLANRULE;


