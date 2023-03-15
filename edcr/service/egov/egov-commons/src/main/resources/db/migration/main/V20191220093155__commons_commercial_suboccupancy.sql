INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage,
minfar, maxfar, occupancy, description,colorcode)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F-RT', 'Restaurants', (select max(ordernumber)+1 from egbpa_sub_occupancy), 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Restaurants',31);

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage,
minfar, maxfar, occupancy, description,colorcode)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F-LD', 'Lodges', (select max(ordernumber)+1 from egbpa_sub_occupancy), 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Lodges',28);

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage,
minfar, maxfar, occupancy, description,colorcode)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F-CB', 'Commercial Building', (select max(ordernumber)+1 from egbpa_sub_occupancy), 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Commercial Office',30);

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage,
minfar, maxfar, occupancy, description,colorcode)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F-IT', 'IT/ITES Building', (select max(ordernumber)+1 from egbpa_sub_occupancy), 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'IT/ITES Building',32);