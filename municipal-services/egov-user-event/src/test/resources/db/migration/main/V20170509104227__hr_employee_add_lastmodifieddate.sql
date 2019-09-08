alter table egeis_employee add column lastmodifieddate  TIMESTAMP WITHOUT TIME ZONE default now();

alter table egeis_employeejurisdictions add column lastmodifieddate  TIMESTAMP WITHOUT TIME ZONE default now();