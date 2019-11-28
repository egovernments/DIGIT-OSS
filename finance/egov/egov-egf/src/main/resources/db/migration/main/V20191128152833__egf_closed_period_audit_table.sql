---alter table for closed period 
alter table closedperiods add column remarks varchar(250);
alter table  closedperiods add column closetype varchar(25);
alter table closedperiods add column createddate timestamp without time zone;
alter table closedperiods add column lastmodifiedby bigint;
alter table closedperiods add column lastmodifieddate timestamp without time zone;
alter table closedperiods add column createdby bigint;


CREATE TABLE closedperiods_aud
(
   id bigint NOT NULL,
  rev integer NOT NULL,
  startingdate timestamp without time zone,
  endingdate timestamp without time zone,
  financialyearid bigint,
  remarks character varying(250),
  lastmodifiedby bigint,
  lastmodifieddate timestamp without time zone,
  revtype numeric,
  isclosed boolean,
  closetype character varying(25)
);
ALTER TABLE ONLY closedperiods_aud ADD CONSTRAINT closedperiods_aud_pkey PRIMARY KEY (id, rev);

