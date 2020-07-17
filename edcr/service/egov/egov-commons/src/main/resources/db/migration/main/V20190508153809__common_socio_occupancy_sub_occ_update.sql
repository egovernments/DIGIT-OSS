INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'S', 'Socio', 't', 0, 1, now(), 1,now(), 40, 1.5, 2.5, 24, 'Socio(S)');   

update egbpa_sub_occupancy set code = 'C-DFPAB', occupancy = (select id from egbpa_occupancy where code='C') where code = 'M-DFPAB';
update egbpa_sub_occupancy set code = 'C-OHF', occupancy = (select id from egbpa_occupancy where code='C') where code = 'M-OHF';
update egbpa_sub_occupancy set code = 'C-VH', occupancy = (select id from egbpa_occupancy where code='C') where code = 'M-VH';
update egbpa_sub_occupancy set code = 'C-NAPI', occupancy = (select id from egbpa_occupancy where code='C') where code = 'M-NAPI';
update egbpa_sub_occupancy set code = 'C-HOTHC', occupancy = (select id from egbpa_occupancy where code='C') where code = 'M-HOTHC';
update egbpa_sub_occupancy set occupancy = (select id from egbpa_occupancy where code='S') where code like 'S-%';