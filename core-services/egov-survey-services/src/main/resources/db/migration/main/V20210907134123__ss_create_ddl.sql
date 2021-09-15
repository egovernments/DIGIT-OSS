CREATE TABLE eg_ss_survey(
    uuid character varying(128),
    tenantid character varying(128),
    title character varying(60),
    description character varying(140),
    status character varying(128),
    startDate bigint,
    endDate bigint,
    collectCitizenInfo boolean,
    postedby character varying(128),
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,
    CONSTRAINT uk_eg_ss_survey UNIQUE (uuid),
    CONSTRAINT pk_eg_ss_survey PRIMARY KEY (tenantid,title,status)
);

CREATE TABLE eg_ss_question(
    uuid character varying(128),
    surveyid character varying(128),
    questionStatement character varying(140),
    options character varying(2048),
    type character varying(128),
    status character varying(128),
    required boolean,
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,
    CONSTRAINT pk_eg_ss_question PRIMARY KEY (uuid),
    CONSTRAINT fk_eg_ss_question FOREIGN KEY (surveyid) REFERENCES eg_ss_survey (uuid)
);

CREATE TABLE eg_ss_answer(
    uuid character varying(128),
    questionid character varying(128),
    surveyid character varying(128),
    answer character varying(2048),
    createdBy character varying(64),
    lastModifiedBy character varying(64),
    createdTime bigint,
    lastModifiedTime bigint,
    citizenid character varying(64),
    mobilenumber character varying(50),
    emailid character varying(128),
    CONSTRAINT pk_eg_ss_answer PRIMARY KEY (uuid),
    CONSTRAINT fk_eg_ss_answer FOREIGN KEY (questionid) REFERENCES eg_ss_question (uuid)
);