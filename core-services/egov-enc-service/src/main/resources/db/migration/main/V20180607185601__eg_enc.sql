DROP TABLE IF EXISTS  eg_enc_symmetric_keys;
DROP TABLE IF EXISTS  eg_enc_asymmetric_keys;


CREATE TABLE public."eg_enc_symmetric_keys"
(
  id SERIAL,
  key_id integer NOT NULL,
  secret_key text NOT NULL,
  initial_vector text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  tenant_id text NOT NULL,
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX eg_symmetric_key_id ON eg_enc_symmetric_keys (key_id);
CREATE UNIQUE INDEX active_tenant_symmetric_keys ON eg_enc_symmetric_keys (tenant_id) WHERE (active is true);

CREATE TABLE public."eg_enc_asymmetric_keys"
(
  id SERIAL,
  key_id integer NOT NULL,
  public_key text NOT NULL,
  private_key text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  tenant_id text NOT NULL,
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX eg_asymmetric_key_id ON eg_enc_asymmetric_keys (key_id);
CREATE UNIQUE INDEX active_tenant_asymmetric_keys ON eg_enc_asymmetric_keys (tenant_id) WHERE (active is true);
