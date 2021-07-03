update eg_occupancy set code='A1' where description='Residential';
update eg_occupancy set code='A2' where description='Special Residential';
update eg_occupancy set code='B1' where description='Educational';
update eg_occupancy set code='C' where description='Medical/Hospital';
update eg_occupancy set code='D' where description='Assembly';
update eg_occupancy set code='E' where description='Office/Business';
update eg_occupancy set code='F' where description='Mercantile / Commercial';
update eg_occupancy set code='G1' where description='Industrial';
update eg_occupancy set code='G2' where description='Small Industrial';
update eg_occupancy set code='H' where description='Storage';
update eg_occupancy set code='I1' where description='Hazardous (1)';
update eg_occupancy set code='I2' where description='Hazardous (2)';
update eg_occupancy set code='14' where description='Thatched / Tiled House';
update eg_occupancy set code='15' where description='Mixed';

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'A3', 'Hostel Educational', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 65, 2.5, 4, 2);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'B2', 'Educational HighSchool', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 35, 2.5, 3, 3);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'B3', 'Higher Educational Institute', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 35, 2.5, 3, 3);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'C1', 'Medical IP', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 60, 2.5, 3.5, 4);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'C2', 'Medical OP', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 60, 2.5, 3.5, 4);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'C3', 'Medical Admin', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 60, 2.5, 3.5, 4);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'D1', 'Assembly Worship', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 40, 1.5, 2.5, 5);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'D2', 'Bus Terminal', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 40, 1.5, 2.5, 5);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'F1', 'Commercial Parking Plaza', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 70, 3, 4, 7);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'F2', 'Commercial Parking Appurtenant', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 70, 3, 4, 7);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'F3', 'Hotels', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 70, 3, 4, 7);