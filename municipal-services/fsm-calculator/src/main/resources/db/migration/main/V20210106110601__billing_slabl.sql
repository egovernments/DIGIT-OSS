CREATE TABLE IF NOT EXISTS  eg_billing_slab(
    id character varying(256) NOT NULL,
    tenantid character varying(256) NOT NULL,
    capacityfrom numeric(12,2),
    capacityto numeric(12,2),
    propertytype character varying(64),
    slum character varying(64),
    price numeric(12,2),
    status character varying(64),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eg_billing_slab PRIMARY KEY (id)
);


CREATE INDEX  IF NOT EXISTS  index_slum_eg_billing_slab  ON eg_billing_slab
(    slum
);
CREATE INDEX  IF NOT EXISTS  index_propertytype_eg_billing_slab  ON eg_billing_slab
(    propertytype
);

CREATE INDEX  IF NOT EXISTS  index_id_eg_billing_slab  ON eg_billing_slab
(
    id
);

CREATE TABLE IF NOT EXISTS  eg_billing_slab_auditlog(
    id character varying(256) NOT NULL,
    tenantid character varying(256) NOT NULL,
    capacityfrom numeric(12,2),
    capacityto numeric(12,2),
    propertytype character varying(64),
    slum character varying(64),
    price numeric(12,2),
    status character varying(64),
    createdby character varying(64),
    lastmodifiedby character varying(64),
    createdtime bigint,
    lastmodifiedtime bigint,
    CONSTRAINT pk_eeg_billing_slab_auditlog PRIMARY KEY (id)
);
CREATE INDEX  IF NOT EXISTS  index_id_eg_billing_slab_auditlog  ON eg_billing_slab_auditlog
(
    id
);