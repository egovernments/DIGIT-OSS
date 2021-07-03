alter table EDCR_PLANINFO ADD COLUMN serviceType character varying(50);
alter table EDCR_PLANINFO ADD COLUMN amenities character varying(200);
alter table EDCR_PLANINFO ADD acchitectId bigint;
ALTER TABLE EDCR_PLANINFO RENAME COLUMN architectname TO architectInformation;

update eg_module set name ='EDCR' where displayname='E-DCR' and contextroot ='edcr';

update eg_action set contextroot ='edcr' where contextroot ='/edcr';

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='New-EdcrApplication'));

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Create-EdcrApplication'));

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Update-EdcrApplication'));

Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='View-EdcrApplication'));


Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Edit-EdcrApplication'));


Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Result-EdcrApplication'));


Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='View EdcrApplication'));


Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Edit EdcrApplication'));


Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Search and View Result-EdcrApplication'));


Insert into eg_roleaction values((select id from eg_role where name='BUSINESS'),(select id from eg_action where name='Search and Edit Result-EdcrApplication'));