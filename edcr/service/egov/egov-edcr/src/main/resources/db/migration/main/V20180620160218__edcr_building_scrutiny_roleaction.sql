insert into eg_module values(nextval('seq_eg_module'),'Dcr Reports','t','edcr',(select id from eg_module where name = 'Digit DCR' and parentmodule is null),'Reports',1);



Insert into eg_action values(nextval('seq_eg_action'),'buildingplanscrutinysearchreport','/reports/buildingplan-scrutinyreport', null,(select id from eg_module where name='Dcr Reports'),1,'Search Building Plan Scrutiny Report ',true,'edcr',0,1,now(),1,now(),(select id from eg_module where name='Digit DCR'));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='buildingplanscrutinysearchreport'));


Insert into eg_action values(nextval('seq_eg_action'),'getStakeHolderNameAndIdByType','/rest/getStakeHolderNameAndIdByType', null ,(select id from eg_module where name='Dcr Reports'),1,'getStakeHolderNameAndIdByType',false,'bpa',0,1,now(),1,now(),(select id from eg_module where name='Digit DCR'));
Insert into eg_roleaction values((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='getStakeHolderNameAndIdByType'));



