--Adding holidaytype column to eg_holiday

alter table eg_holiday add column holidaytype integer;

--eg_holidaytype table
create table eg_holidaytype (id bigint  NOT NULL,name character varying(200) NOT NULL,tenantid character varying(250) NOT NULL
,CONSTRAINT pk_holidattype PRIMARY KEY (id,tenantid));

CREATE SEQUENCE seq_eg_holidaytype
  INCREMENT 1
  START 1;

ALTER TABLE eg_holiday add
CONSTRAINT fk_eg_holiday_holidaytype_tenantid FOREIGN KEY (holidaytype, tenantid) 
REFERENCES eg_holidaytype (id, tenantid);

