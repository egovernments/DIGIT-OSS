CREATE TABLE eg_pt_alternatenumbers(

   id                   CHARACTER VARYING (128) NOT NULL,
   uuid                 CHARACTER VARYING (128) NOT NULL,
   propertyid           CHARACTER VARYING (256) NOT NULL,
   tenantid             CHARACTER VARYING (256) NOT NULL,
   name                CHARACTER VARYING (256) NOT NULL,
   mobilenumber          CHARACTER VARYING (256) NOT NULL,

   CONSTRAINT pk_eg_pt_alternatenumbers PRIMARY KEY (id),
   CONSTRAINT fk_eg_pt_alternatenumbers FOREIGN KEY (propertyid) REFERENCES eg_pt_property (id)
);