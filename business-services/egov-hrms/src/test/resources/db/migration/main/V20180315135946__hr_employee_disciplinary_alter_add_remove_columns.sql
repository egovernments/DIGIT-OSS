ALTER TABLE egeis_disciplinary DROP COLUMN orderno;

ALTER TABLE egeis_disciplinary DROP COLUMN orderdate;

alter table egeis_disciplinary add column punishmentimplemented BOOLEAN;

alter table egeis_disciplinary add column enddateofpunishment DATE;