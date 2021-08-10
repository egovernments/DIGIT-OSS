alter table egeis_servicehistory
add column city CHARACTER VARYING(250),
add column department CHARACTER VARYING(250),
add column designation CHARACTER VARYING(250),
add column positionId BIGINT,
add column serviceTo DATE,
add column isAssignmentBased BOOLEAN NOT NULL DEFAULT false,
add column assignmentId BIGINT ;