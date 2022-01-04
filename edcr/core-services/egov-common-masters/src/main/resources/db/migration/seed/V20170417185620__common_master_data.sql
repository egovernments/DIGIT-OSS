
insert into eg_religion(id,name,description,active,tenantid) values(nextval('seq_eg_religion'),'Hindu','Hindu',true,'default');
insert into eg_religion(id,name,description,active,tenantid) values(nextval('seq_eg_religion'),'Muslim','Muslim',true,'default');
insert into eg_religion(id,name,description,active,tenantid) values(nextval('seq_eg_religion'),'Christian','Christian',true,'default');

insert into eg_category(id,name,description,active,tenantid) values(nextval('seq_eg_category'),'SC','Schedule Caste',true,'default');
insert into eg_category(id,name,description,active,tenantid) values(nextval('seq_eg_category'),'ST','Schedule Tribe',true,'default');
insert into eg_category(id,name,description,active,tenantid) values(nextval('seq_eg_category'),'GEN','General',true,'default');

insert into eg_language(id,name,description,active,tenantid) values(nextval('seq_eg_language'),'Kannada','Kannada',true,'default');
insert into eg_language(id,name,description,active,tenantid) values(nextval('seq_eg_language'),'Hindi','Hindi',true,'default');
insert into eg_language(id,name,description,active,tenantid) values(nextval('seq_eg_language'),'Telugu','Telugu',true,'default');
insert into eg_language(id,name,description,active,tenantid) values(nextval('seq_eg_language'),'English','English',true,'default');

insert into eg_community(id,name,description,active,tenantid) values(nextval('seq_eg_community'),'Iyers','Iyers',true,'default');
insert into eg_community(id,name,description,active,tenantid) values(nextval('seq_eg_community'),'Rajputs','Rajputs',true,'default');
insert into eg_community(id,name,description,active,tenantid) values(nextval('seq_eg_community'),'Lingayats','Lingayats',true,'default');

insert into eg_calendarYear(id,name,startdate,enddate,active,tenantid) values(nextval('seq_eg_calendarYear'),2015,'2015-01-01','2015-12-31',true,'default');
insert into eg_calendarYear(id,name,startdate,enddate,active,tenantid) values(nextval('seq_eg_calendarYear'),2016,'2016-01-01','2016-12-31',true,'default');
insert into eg_calendarYear(id,name,startdate,enddate,active,tenantid) values(nextval('seq_eg_calendarYear'),2017,'2017-01-01','2017-12-31',true,'default');






