CREATE TABLE eg_vt_registration(
 id character varying(64),
 tenantId character varying(64),
 assemblyConstituency character varying(64),
 applicationNumber character varying(64),
 applicantId character varying(64),
 dateSinceResidence bigint,
 createdBy character varying(64),
 lastModifiedBy character varying(64),
 createdTime bigint,
 lastModifiedTime bigint,
 CONSTRAINT uk_eg_tl_TradeLicense UNIQUE (id)
);
CREATE TABLE eg_vt_address(
   id character varying(64),
   tenantId character varying(64),
   doorNo character varying(64),
   latitude FLOAT,
   longitude FLOAT,
   buildingName character varying(64),
   addressId character varying(64),
   addressNumber character varying(64),
   type character varying(64),
   addressLine1 character varying(256),
   addressLine2 character varying(256),
   landmark character varying(64),
   street character varying(64),
   city character varying(64),
   locality character varying(64),
   pincode character varying(64),
   detail character varying(64),
   registrationId character varying(64),
   createdBy character varying(64),
   lastModifiedBy character varying(64),
   createdTime bigint,
   lastModifiedTime bigint,
   CONSTRAINT uk_eg_tl_address PRIMARY KEY (id),
   CONSTRAINT fk_eg_tl_address FOREIGN KEY (registrationId) REFERENCES eg_vt_registration (id)
     ON UPDATE CASCADE
     ON DELETE CASCADE
);