--------------------------------OCCUPANCY MASTER DATA ---------------------------

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'A', 'Residential', 't', 0, 1, now(), 1,now(), 65, 3, 4, 1, 'Residential');

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'B', 'Educational', 't', 0, 1, now(), 1,now(), 35, 2.5, 3, 6, 'Educational');

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'C', 'Medical/Hospital', 't', 0, 1, now(), 1,now(), 60, 2.5, 3.5, 10, 'Medical/Hospital');  

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'D', 'Assembly', 't', 0, 1, now(), 1,now(), 40, 1.5, 2.5, 14, 'Assembly');

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'E', 'Office/Business', 't', 0, 1, now(), 1,now(), 70, 3, 4, 17, 'Office/ Business');

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'F', 'Mercantile / Commercial', 't', 0, 1, now(), 1,now(), 70, 3, 4, 18, 'Mercantile/Commercial');   

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'G', 'Industrial', 't', 0, 1, now(), 1,now(), 65, 2.5, 3, 22, 'G (Industrial)');   

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'H', 'Storage', 't', 0, 1, now(), 1,now(), 80, 3, 4, 24, 'Storage -H'); 

INSERT INTO egbpa_occupancy(id, code, name, isactive, version, createdby, createddate, lastmodifiedby,lastmodifieddate, maxcoverage, minfar, maxfar, ordernumber, description)
VALUES (nextval('seq_egbpa_occupancy'), 'I', 'Hazardous', 't', 0, 1, now(), 1,now(), 40, 1.5, 2.5, 24, 'Hazardous(I)');   


--------------------------------SUBOCCUPANCY MASTER DATA ---------------------------

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'A1', 'Residential', 1, 't', 1, now(), now(), 1, 0, 65, 3, 4, (select id from egbpa_occupancy where code='A'), 'Residential A1- Single family');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'A2', 'Special Residential', 2, 't', 1, now(), now(), 1, 0, 65, 2.5, 4, (select id from egbpa_occupancy where code='A'), 'Special residential A2');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'A3', 'Hostel Educational', 3, 't', 1, now(), now(), 1, 0, 65, 5, 4, (select id from egbpa_occupancy where code='A'), 'Special residential A2- Hostels');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'A4', 'Apartment/Flat', 4, 't', 1, now(), now(), 1, 0, 65, 3, 4, (select id from egbpa_occupancy where code='A'), 'Residential A1');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'A5', 'Professional Office', 5, 't', 1, now(), now(), 1, 0, 65, 3, 4, (select id from egbpa_occupancy where code='A'), 'Residential A1 - Professional office');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'B1', 'Educational', 6, 't', 1, now(), now(), 1, 0, 35, 2.5, 3, (select id from egbpa_occupancy where code='B'), 'Educational -B - Up to High Schools');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'B2', 'Educational HighSchool', 8, 't', 1, now(), now(), 1, 0, 35, 2.5, 3, (select id from egbpa_occupancy where code='B'), 'Educational -B-Higher Secondary/ Junior Technical');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'B3', 'Higher Educational Institute', 9, 't', 1, now(), now(), 1, 0, 35, 2.5, 3, (select id from egbpa_occupancy where code='B'), 'Educational -B-Higher education/ Research');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'C1', 'Medical IP', 11, 't', 1, now(), now(), 1, 0, 60, 2.5, 3.5, (select id from egbpa_occupancy where code='C'), 'Medical -C (Floor area more than 150 m2) - IP section');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'C2', 'Medical OP', 12, 't', 1, now(), now(), 1, 0, 60, 2.5, 3.5, (select id from egbpa_occupancy where code='C'), 'Medical -C (Floor area more than 150 m2) - OP section');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'C3', 'Medical Admin', 13, 't', 1, now(), now(), 1, 0, 60, 2.5, 3.5, (select id from egbpa_occupancy where code='C'), 'Medical -C (Floor area more than 150 m2) - Admin');


INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'D1', 'Assembly Worship', 15, 't', 1, now(), now(), 1, 0, 40, 1.5, 2.5, (select id from egbpa_occupancy where code='D'), 'Assembly (more than 150 m2)');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'D2', 'Bus Terminal', 16, 't', 1, now(), now(), 1, 0, 40, 1.5, 2.5, (select id from egbpa_occupancy where code='D'), 'Assembly (more than 150 m2)');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'E1', 'Office/Business', 17, 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='E'), 'Office/ Business (more than 300m2)');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F1', 'Commercial Parking Plaza', 19, 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Commercial Parking Plaza');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F2', 'Commercial Parking Appurtenant', 20, 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Appurtenant Parking');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F3', 'Hotels', 21, 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Hotels');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'F4', 'Kiosk', 29, 't', 1, now(), now(), 1, 0, 70, 3, 4, (select id from egbpa_occupancy where code='F'), 'Kiosk');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'G1', 'Large Industrial', 22, 't', 1, now(), now(), 1, 0, 65, 2.5, 0, (select id from egbpa_occupancy where code='G'), 'G1 (Large scale)');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'G2', 'Small Industrial', 23, 't', 1, now(), now(), 1, 0, 75, 3.5, 4, (select id from egbpa_occupancy where code='G'), 'G2 (Small Scale)');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'H1', 'Storage', 24, 't', 1, now(), now(), 1, 0, 80, 3, 4, (select id from egbpa_occupancy where code='H'), 'Storage -H1');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'I1', 'Hazardous (I1)', 25, 't', 1, now(), now(), 1, 0, 45, 2, 0, (select id from egbpa_occupancy where code='I'), 'Hazardous (I-1)');

INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxcoverage, 
minfar, maxfar, occupancy, description)  VALUES (nextval('seq_egbpa_sub_occupancy'), 'I2', 'Hazardous (I2)', 26, 't', 1, now(), now(), 1, 0, 40, 1.5, 0, (select id from egbpa_occupancy where code='I'), 'Hazardous (I-2)');


--------------------------------USAGES MASTER DATA ---------------------------


INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A1-01', 'Single family residential', 'Single family residential', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A5-01', 'Proffessional offices part of residential use with floor area less than 50 m2', 'Proffessional offices part of residential use with floor area less than 50 m2', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A5'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A4-01', 'Family residential', 'Family residential', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A4'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A4-02', 'Apartment house', 'Apartment house', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A4'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A4-03', 'Residential flats', 'Residential flats', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A4'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A4-04', 'Small proffessional offices or spaces with less than 50m2 floor area as part of principal residential occupancy', 'Small proffessional offices or spaces with less than 50m2 floor area as part of principal residential occupancy', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A4'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-01', 'Lodging house' ,'Lodging house', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-02', 'Rooming house', 'Rooming house', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-03', 'Dormitory' ,'Dormitory', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-04', 'ourist Home', 'ourist Home', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-05', 'Tourist Resort', 'Tourist Resort', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-06', 'Hostel' ,'Hostel', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-07', 'Hostel', 'Hotel', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-08', 'Hotel with conference room', 'Hotel with conference room', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-09', 'Hotel with Community hall room','Hotel with conference room', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-10', 'Hotel with dining room', 'Hotel with dining room', 't', 10, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-11', 'Hotel with assembly room','Hotel with assembly room', 't', 11, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-12', 'Creches','Creches', 't', 12, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-13', 'Day care centres', 'Day care centres', 't', 13, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-14', 'Childrens nursary', 'Childrens nursary', 't', 14, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-15', 'reading rooms', 'reading rooms', 't', 15, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-16', 'Libraries not exceeding 150 m2 floor area', 'Libraries not exceeding 150 m2 floor area', 't', 16, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-17', 'Educational institution not exceeding 150 m2 floor area', 'Educational institution not exceeding 150 m2 floor area', 't', 17, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'A2-18', 'Educational institution not exceeding 150 m2 floor area' ,'Educational institution not exceeding 150 m2 floor area', 't', 18, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='A2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B1-01', 'Nursary School', 'Nursary School', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B1-02', 'Pre School' ,'Pre School', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B1-03', 'Lower Primary School', 'Lower Primary School', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B1-04', 'Upper Primary School' ,'Upper Primary School', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B1-05', 'B1-05 High School 5' ,'B1-05 High School 5', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B2-01', 'Higher Secondary School', 'Higher Secondary School', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B2-02', 'Junior Technical School 2' ,'Junior Technical School 2', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B2-03', 'Industrial Training Institutes','Industrial Training Institutes', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B3-01', 'Higher Educational Institution','Higher Educational Institution', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B3-02', 'Research Institute','Research Institute', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B3-03', 'Engineering Education Institution','Engineering Education Institution', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B3-04', 'Medical/ Health Education Institution', 'Medical/ Health Education Institution', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B3-05', 'Architectural Educational Institution' ,'Architectural Educational Institution', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'B3-06', 'Proffessional Educational Institution', 'Proffessional Educational Institution', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='B3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-01', 'Medical treatment', 'Medical treatment', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-02', 'Hospital' ,'Hospital', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-03', 'Clinic', 'Clinic', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-04', 'Mental Hospital' ,'Mental Hospital', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-05', 'Speciallity Hospital', 'Speciallity Hospital', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-06', 'Infant care hospital', 'Infant care hospital', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-07', 'Old aged care centre', 'Old aged care centre', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-08', 'Convalescents centre', 'Convalescents centre', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C1-09', 'Paliative care centre' ,'Paliative care centre', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C1'));


INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-01', 'Medical treatment', 'Medical treatment', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-02', 'Hospital', 'Hospital', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-03', 'Clinic', 'Clinic', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-04', 'Mental Hospital', 'Mental Hospital', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-05', 'Speciallity Hospital', 'Speciallity Hospital', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-06', 'Infant care hospital', 'Infant care hospital', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-07', 'Old aged care centre' ,'Old aged care centre', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-08', 'Convalescents centre' ,'Convalescents centre', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C2-09', 'Paliative care centre', 'Paliative care centre', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-01', 'Medical treatment', 'Medical treatment', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-02', 'Hospital', 'Hospital', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-03', 'Clinic', 'Clinic', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-04', 'Mental Hospital', 'Mental Hospital', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-05', 'Speciallity Hospital', 'Speciallity Hospital', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-06', 'Infant care hospital', 'Infant care hospital', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-07', 'Old aged care centre', 'Old aged care centre', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-08', 'Convalescents centre', 'Convalescents centre', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'C3-09', 'Paliative care centre' ,'Paliative care centre', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='C3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'D1-01', 'Worship Hall', 'Worship Hall', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='D1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'D1-02', 'Religious prayer hall', 'Religious prayer hall', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='D1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'D1-03', 'Religious congregation' ,'Religious congregation', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='D1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'D2-01', 'Transportation terminal', 'Transportation terminal', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='D2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'D2-02', 'Passenger stations', 'Passenger stations', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='D2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'D2-03', 'Travel congregation', 'Travel congregation', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='D2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'F1-01', 'Commercial Parking Plaza', 'Commercial Parking Plaza', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='F1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'F2-01', 'Appurtenant Parking', 'Appurtenant Parking', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='F2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'F3-01', 'Restaurant', 'Restaurant', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='F3'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G2-01', 'Fabricating, Assembling and Processing unit (Occupancy type G2)', 'Fabricating, Assembling and Processing unit (Occupancy type G2)', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G2-02', 'Poultry Farm with more than 20 hens/ducks', 'Poultry Farm with more than 20 hens/ducks', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G2-03', 'Dairy farm with more than 6 cattle' ,'Dairy farm with more than 6 cattle', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G2-04', 'Kennel with more than 6 dogs', 'Kennel with more than 6 dogs', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-01', 'Auto mobile wash stall' ,'Auto mobile wash stall', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-02', 'Automobile service station', 'Automobile service station', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-03', 'Service garages- with repairing facility', 'Service garages- with repairing facility', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-04', 'Welding workshops', 'Welding workshops', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-05', 'PVC pipe manufacturing unit, through injection/extrusion moulding', 'PVC pipe manufacturing unit, through injection/extrusion moulding', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-06', 'Building which produce minor nature of air and sound pollution (Hazardous Type -I1)' ,'Building which produce minor nature of air and sound pollution (Hazardous Type -I1)', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I1-07', 'Building which produce effuents which does not cause very adverse environmental effects type  (Hazardous Type -I1)' ,'Building which produce effuents which does not cause very adverse environmental effects type  (Hazardous Type -I1)', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-01', 'Auto mobile wash stall', 'Auto mobile wash stall', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-02', 'Storage and handling of hazardous and highly inflammable liquids', 'Storage and handling of hazardous and highly inflammable liquids', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-03', 'Storage and handling of hazardous and highly inflammable or explosive materials other than liquids', 'Storage and handling of hazardous and highly inflammable or explosive materials other than liquids', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-04', 'Gas bottling plant', 'Gas bottling plant', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-05', 'Petrol and diesel storage tank', 'Petrol and diesel storage tank', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-06', 'Manufacture of plastic goods', 'Manufacture of plastic goods', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-07', 'Manufacture of synthetic leather', 'Manufacture of synthetic leather', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-08', 'Manufacture of ammunition', 'Manufacture of ammunition', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-09', 'Manufacture of explosive', 'Manufacture of explosive', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-10', 'Manfacture of fire works', 'Manfacture of fire works', 't', 10, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-11', 'Crematorium', 'Crematorium', 't', 11, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-12', 'Burial ground', 'Burial ground', 't', 12, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-13', 'Garbage dumping yard', 'Garbage dumping yard', 't', 13, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-14', 'Abattoir', 'Abattoir', 't', 14, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-15', 'Sewage treatment plant', 'Sewage treatment plant', 't', 15, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-16', 'Stone crusher unit', 'Stone crusher unit', 't', 16, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-17', 'Automobile fuel filling station', 'Automobile fuel filling station', 't', 17, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-18', 'Coal yard', 'Coal yard', 't', 18, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-19', 'Wood and timber yard', 'Wood and timber yard', 't', 19, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-20', 'Wood and timber yrd with saw mill', '', 't', 20, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-21', 'Storage/ Handling/ Manufacturing/ processing of Highly combustible type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Highly combustible type products  (Hazardous Type -I2)', 't', 21, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-22', 'Storage/ Handling/ Manufacturing/ processing of Explosive type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Explosive type products  (Hazardous Type -I2)', 't', 22, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-23', 'Storage/ Handling/ Manufacturing/ processing of Corrossive type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Corrossive type products  (Hazardous Type -I2)', 't', 23, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-24', 'Storage/ Handling/ Manufacturing/ processing of Poisonous type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Poisonous type products  (Hazardous Type -I2)', 't', 24, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-25', 'Storage/ Handling/ Manufacturing/ processing of Irritant type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Irritant type products  (Hazardous Type -I2)', 't', 25, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-26', 'Storage/ Handling/ Manufacturing/ processing of toxic type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of toxic type products  (Hazardous Type -I2)', 't', 26, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-27', 'Storage/ Handling/ Manufacturing/ processing of noxious type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of noxious type products  (Hazardous Type -I2)', 't', 27, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-28', 'Storage/ Handling/ Manufacturing/ processing of Producing dust type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Producing dust type products  (Hazardous Type -I2)', 't', 28, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'I2-29', 'Storage/ Handling/ Manufacturing/ processing of Fire Works type products  (Hazardous Type -I2)', 'Storage/ Handling/ Manufacturing/ processing of Fire Works type products  (Hazardous Type -I2)', 't', 29, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='I2'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-01', 'Storage', 'Storage', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-02', 'Servicing/ Reparing/ Processing unit incidental to storage', 'Servicing/ Reparing/ Processing unit incidental to storage', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-03', 'Sheltering', 'Sheltering', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-04', 'Storage of goods', 'Storage of goods', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-05', 'Storage of mercantiles', 'Storage of mercantiles', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-06', 'Storage of vehicles', 'Storage of vehicles', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-07', 'Warehouse', 'Warehouse', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-08', 'Freight Depot', 'Freight Depot', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-09', 'Transit shed', 'Transit shed', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-10', 'Store house', 'Store house', 't', 10, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-11', 'Garage 11', 'Garage 11', 't', 11, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-12', 'Hanger', 'Hanger', 't', 12, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-13', 'Grain elevator', 'Grain elevator', 't', 13, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-14', 'Barn', 'Barn', 't', 14, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'H1-15', 'sylo', 'sylo', 't', 15, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='H1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-01', 'Workshop without welding facility', 'Workshop without welding facility', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-02', 'Assembly Plant', 'Assembly Plant', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-03', 'Laboratory', 'Laboratory', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-04', 'Dry cleaning Plant', 'Dry cleaning Plant', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-05', 'Power Plant', 'Power Plant', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-06', 'Pumping Stataion', 'Pumping Stataion', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-07', 'Smoke House', 'Smoke House', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-08', 'Laundry', 'Laundry', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-09', 'Gas Plant', 'Gas Plant', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-10', 'Refinery', 'Refinery', 't', 10, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-11', 'Dairy', 'Dairy', 't', 11, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-12', 'Saw Mill', 'Saw Mill', 't', 12, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'G1-13', 'Fabricating, Assembling and Processing unit (Occupancy type Type G1)', 'Fabricating, Assembling and Processing unit (Occupancy type Type G1)', 't', 13, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='G1'));


INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-01', 'Public business', 'Public business', 't', 1, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-02', 'Private business', 'Private business', 't', 2, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-03', 'Public Office', 'Public Office', 't', 3, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-04', 'Private office', 'Private office', 't', 4, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-05', 'Records/ Accounts Office', 'Records/ Accounts Office', 't', 5, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-06', 'Local Government Office', 'Local Government Office', 't', 6, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-07', 'State Government office', 'State Government office', 't', 7, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-08', 'Central Government office', 'Central Government office', 't', 8, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-09', 'Private sector Office', 'Private sector Office', 't', 9, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-10', 'Quasi Government agency office', 'Quasi Government agency office', 't', 10, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-11', 'Defense use office', 'Defense use office', 't', 11, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-12', 'Court house', 'Court house', 't', 12, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-13', 'Public utility building', 'Public utility building', 't', 13, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-14', 'Jail/ Prison', 'Jail/ Prison', 't', 14, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-15', 'Information Technology Office', 'Information Technology Office', 't', 15, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-16', 'Government owned Information Technology park', 'Government owned Information Technology park', 't', 16, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-17', 'Government approved Private Information Technology Park', 'Government approved Private Information Technology Park', 't', 17, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-18', 'Government approved Private Information Technology Office', 'Government approved Private Information Technology Office', 't', 18, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-19', 'Ancillary or support service to Information Technology', 'Ancillary or support service to Information Technology', 't', 19, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-20', 'Office for Information Technology Parks', 'Office for Information Technology Parks', 't', 20, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-21', 'Residences for for Information Technology Parks', 'Residences for for Information Technology Parks', 't', 21, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-22', 'Social amenities for Information Technology Park', 'Social amenities for Information Technology Park', 't', 22, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-23', 'Recreational facilities for Information Technology Park', 'Recreational facilities for Information Technology Park', 't', 23, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));

INSERT INTO egbpa_usage(id, code, name, description, isactive, ordernumber, version,createdby, createddate, lastmodifiedby, lastmodifieddate, suboccupancy)
VALUES (nextval('SEQ_EGBPA_USAGE'), 'E1-24', 'Commercial establishments for Information Technology Park', 'Commercial establishments for Information Technology Park', 't', 24, 0, 1, now(), 1, now(), (select id from egbpa_sub_occupancy where code='E1'));


