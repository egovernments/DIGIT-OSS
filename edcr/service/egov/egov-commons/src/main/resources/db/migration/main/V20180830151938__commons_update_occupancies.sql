update EG_OCCUPANCY set ordernumber =3 where code='A3';

update EG_OCCUPANCY set ordernumber =6 where code='B1';

update EG_OCCUPANCY set ordernumber =7 where code='B2';

update EG_OCCUPANCY set ordernumber =8 where code='B2';

update EG_OCCUPANCY set ordernumber =9 where code='B3';

update EG_OCCUPANCY set ordernumber =10 where code='C';

update EG_OCCUPANCY set ordernumber =11 where code='C1';

update EG_OCCUPANCY set ordernumber =12 where code='C2';

update EG_OCCUPANCY set ordernumber =13 where code='C3';

update EG_OCCUPANCY set ordernumber =14 where code='D';

update EG_OCCUPANCY set ordernumber =15 where code='D1';

update EG_OCCUPANCY set ordernumber =16 where code='D2';

update EG_OCCUPANCY set ordernumber =17 where code='E';

update EG_OCCUPANCY set ordernumber =18 where code='F';

update EG_OCCUPANCY set ordernumber =19 where code='F1';

update EG_OCCUPANCY set ordernumber =20 where code='F2';

update EG_OCCUPANCY set ordernumber =21 where code='F3';

update EG_OCCUPANCY set ordernumber =22 where code='G1';

update EG_OCCUPANCY set ordernumber =23 where code='G2';

update EG_OCCUPANCY set ordernumber =24 where code='H';

update EG_OCCUPANCY set ordernumber =25 where code='I1';

update EG_OCCUPANCY set ordernumber =26 where code='I2';

update EG_OCCUPANCY set ordernumber =27 where code='14';

update EG_OCCUPANCY set ordernumber =28 where code='15';

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'A4', 'Apartment/Flat', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 65, 3, 4, 4);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), 'A5', 'Professional Office', true, 0, 1, now(), 1, now(), NULL, NULL, NULL, 65, 3, 4, 5);