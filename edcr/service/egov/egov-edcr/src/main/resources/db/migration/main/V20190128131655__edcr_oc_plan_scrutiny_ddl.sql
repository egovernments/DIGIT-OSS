alter table EDCR_APPLICATION add column applicationType character varying(48);

alter table EDCR_APPLICATION add column permitApplicationDate date;

alter table EDCR_APPLICATION add column planPermitNumber character varying(30);

alter table EDCR_APPLICATION add column buildingLicensee bigint;

alter table  EDCR_APPLICATION ADD CONSTRAINT fk_edcr_appln_bldg_licensee FOREIGN KEY (buildingLicensee)
      REFERENCES eg_user (id);

create sequence SEQ_OC_PLAN_SCRUTINYNO;