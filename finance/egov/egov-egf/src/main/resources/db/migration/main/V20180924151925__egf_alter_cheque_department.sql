ALTER TABLE CHEQUE_DEPT_MAPPING DROP constraint chequedept_dept_fk RESTRICT;

alter table CHEQUE_DEPT_MAPPING ALTER COLUMN allotedto TYPE character varying(50);
