CREATE TABLE public.eg_noc(
    id character varying(256) NOT NULL,
    applicationno character varying(64),
    tenantid character varying(256),
    status character varying(64),
    landid character varying(256),
    additionaldetails jsonb,
    createdby character varying(256),
    lastmodifiedby character varying(256),
    createdtime bigint,
    lastmodifiedtime bigint,
    nocNo character varying(64) DEFAULT NULL,
    applicationType character varying(64) NOT NULL,
    nocType character varying(64) NOT NULL,
    accountid character varying(256) DEFAULT NULL,
    source character varying(64) NOT NULL,
    sourcerefid character varying(256) NOT NULL,
    applicationstatus character varying(64) NOT NULL,
    CONSTRAINT pk_eg_noc PRIMARY KEY (id)
);

CREATE TABLE public.eg_noc_auditdetails(
    id character varying(256)  NOT NULL,
     applicationno character varying(64),
    tenantid character varying(256),
    status character varying(64),
    landid character varying(256),
    additionaldetails jsonb,
    createdby character varying(256),
    lastmodifiedby character varying(256),
    createdtime bigint,
    lastmodifiedtime bigint,
    nocNo character varying(64) DEFAULT NULL,
    applicationType character varying(64) NOT NULL,
    nocType character varying(64) NOT NULL,
    accountid character varying(256) DEFAULT NULL,
    source character varying(64) NOT NULL,
    sourcerefid character varying(256) NOT NULL,
    applicationstatus character varying(64) NOT NULL
);

CREATE TABLE public.eg_noc_document(
    id character varying(64)  NOT NULL,
    documenttype character varying(64),
    filestoreid character varying(64),
    documentuid character varying(64),
    nocid character varying(64),
    additionaldetails jsonb,
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT uk_eg_noc_document PRIMARY KEY (id),
    CONSTRAINT fk_eg_noc_document FOREIGN KEY (nocid)
        REFERENCES public.eg_noc (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE INDEX noc_index  ON public.eg_noc 
(
    applicationno,
    nocno,
    tenantid,
    id,
    applicationstatus,
    noctype
);

