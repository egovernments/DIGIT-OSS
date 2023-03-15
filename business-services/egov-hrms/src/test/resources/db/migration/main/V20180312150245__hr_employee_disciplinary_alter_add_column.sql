alter table egeis_disciplinary add column courtOrderType CHARACTER VARYING(250);

alter table egeis_disciplinary add column presentingOfficerDesignation CHARACTER VARYING(250);

alter table egeis_disciplinary add column enquiryOfficerDesignation CHARACTER VARYING(250);

alter table egeis_disciplinary alter column memoServingDate drop NOT NULL;