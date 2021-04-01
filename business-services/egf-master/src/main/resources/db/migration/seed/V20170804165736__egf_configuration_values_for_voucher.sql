insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('db2c257a-e5b5-41e2-a73a-a5b0d86b4467',(select id from egf_financialconfiguration where keyname = 'Pre-approved voucher status'),'5','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('8dd955b9-8676-42a8-b524-c7616288cc58',(select id from egf_financialconfiguration where keyname = 'Approved voucher status'),'0','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('c1cb84f7-7427-4dac-9588-b9480421d97b',(select id from egf_financialconfiguration where keyname = 'Default voucher creation status'),'0','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('fe6f48bc-f6df-4869-8a25-36421dadfb15',(select id from egf_financialconfiguration where keyname = 'Default transaction mis attrributes'),'department|M','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('0d0b4ab5-57f7-44c4-a633-d8d2f73b356e',(select id from egf_financialconfiguration where keyname = 'Default transaction mis attrributes'),'fund|M','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('5493e25b-cf58-4d1a-a715-9298f10b7a42',(select id from egf_financialconfiguration where keyname = 'Default transaction mis attrributes'),'function|M','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('38d7f782-842d-4893-a7d4-b44c60e9dc48',(select id from egf_financialconfiguration where keyname = 'Journal voucher confirm on create'),'0','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('bd435fbf-bc65-4700-bfb1-b114ea5fabd1',(select id from egf_financialconfiguration where keyname = 'Use billdate in create voucher from bill'),'N','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('e4a4daf7-2098-4ee2-94b4-8e3c7da88221',(select id from egf_financialconfiguration where keyname = 'Bank balance mandatory'),'N','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('0a4a5bf6-d655-4cc3-bdc3-e84c1496608e',(select id from egf_financialconfiguration where keyname = 'Voucher date from UI'),'Y','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('cf7ef4f9-cc0e-4d5c-8dc7-702802195001',(select id from egf_financialconfiguration where keyname = 'If restricted to one function center'),'Yes','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('2411d97f-1f23-4134-93a3-24369e21320b',(select id from egf_financialconfiguration where keyname = 'Data entry cut off date'),'30-Jun-2017','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('4fc471b3-8b6c-4704-85ca-e9c7f1821662',(select id from egf_financialconfiguration where keyname = 'Auto generate receipt vouchernumber'),'Y','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('03120edf-eb43-40f2-84c2-bb719ff4a405',(select id from egf_financialconfiguration where keyname = 'Auto generate payment vouchernumber'),'Y','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('3587adf9-3195-4a13-b4fa-61d147e24063',(select id from egf_financialconfiguration where keyname = 'Auto generate contra vouchernumber'),'Y','01/01/2017',1,now(),1,now(),'default');

insert into egf_financialconfigurationvalues(id,keyid,value,effectivefrom,createdby,createddate,lastmodifiedby,lastmodifieddate,tenantId)
values('07c8e274-29be-4ec6-8170-e2f6a0011ea7',(select id from egf_financialconfiguration where keyname = 'Auto generate journal vouchernumber'),'Y','01/01/2017',1,now(),1,now(),'default');
