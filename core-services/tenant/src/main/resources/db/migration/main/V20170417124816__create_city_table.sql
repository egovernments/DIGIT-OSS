CREATE SEQUENCE seq_city;

CREATE TABLE city
(
  id bigint NOT NULL,
  name varchar(256) NOT NULL,
  localname varchar(256),
  districtcode varchar(10),
  districtname varchar(50),
  regionname varchar(50),
  longitude double precision,
  latitude double precision,
  tenantcode varchar(256) NOT NULL,
  createdby bigint,
  createddate timestamp DEFAULT now(),
  lastmodifiedby bigint,
  lastmodifieddate timestamp DEFAULT now(),
  CONSTRAINT city_pkey PRIMARY KEY (id),
  CONSTRAINT fk_tenantcode FOREIGN KEY (tenantcode) REFERENCES tenant(code)
)