DROP TABLE IF EXISTS  eg_tenants;

CREATE TABLE public."eg_tenants"
(
    id SERIAL,
    tenant_id text NOT NULL,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX eg_tenant_id ON eg_tenants (tenant_id);
INSERT INTO eg_tenants (tenant_id) VALUES ('default');
