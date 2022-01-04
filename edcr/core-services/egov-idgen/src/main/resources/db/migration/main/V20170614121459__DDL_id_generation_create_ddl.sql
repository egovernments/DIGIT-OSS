CREATE TABLE id_generator
(
    id bigserial NOT NULL,
    idname character varying(200) NOT NULL,
    tenantid character varying(200) NOT NULL,
    format character varying(200) NOT NULL,
    sequencenumber  integer NOT NULL,
    
    CONSTRAINT pk_id_generator PRIMARY KEY (id)
);
CREATE SEQUENCE SEQ_ACK_NUM;
CREATE SEQUENCE SEQ_ASSESMNT_NUM;

