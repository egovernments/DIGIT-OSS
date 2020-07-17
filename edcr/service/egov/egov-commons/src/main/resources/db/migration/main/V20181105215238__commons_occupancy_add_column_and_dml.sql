ALTER TABLE eg_occupancy ADD COLUMN parent bigint;

ALTER TABLE eg_occupancy ADD CONSTRAINT fk_eg_occupancy_parent FOREIGN KEY (parent)
   REFERENCES eg_occupancy (id);

ALTER TABLE eg_occupancy ADD COLUMN additionaldescription character varying(1024);

update eg_occupancy set additionaldescription ='Residential A1- Single family' where code='A1';
update eg_occupancy set additionaldescription ='Special residential A2' where code='A2';
update eg_occupancy set additionaldescription ='Special residential A2- Hostels' where code='A3';
update eg_occupancy set additionaldescription ='Residential A1' where code='A4';
update eg_occupancy set additionaldescription ='Residential A1 - Professional office' where code='A5';
update eg_occupancy set additionaldescription ='Educational -B - Up to High Schools' where code='B1';
update eg_occupancy set additionaldescription ='Educational -B-Higher Secondary/ Junior Technical ' where code='B2';
update eg_occupancy set additionaldescription ='Educational -B-Higher education/ Research' where code='B3';
update eg_occupancy set additionaldescription ='Medical/Hospital' where code='C';
update eg_occupancy set additionaldescription ='Medical -C (Floor area more than 150 m2) - IP section' where code='C1';
update eg_occupancy set additionaldescription ='Medical -C (Floor area more than 150 m2) - OP section' where code='C2';
update eg_occupancy set additionaldescription ='Medical -C (Floor area more than 150 m2) - Admin ' where code='C3';
update eg_occupancy set additionaldescription ='Assembly (more than 150 m2)' where code='D';
update eg_occupancy set additionaldescription ='Assembly (more than 150 m2)' where code='D1';
update eg_occupancy set additionaldescription ='Assembly (more than 150 m2)' where code='D2';
update eg_occupancy set additionaldescription ='Office/ Business (more than 300m2)' where code='E';
update eg_occupancy set additionaldescription ='Mercantile/Commercial' where code='F';
update eg_occupancy set additionaldescription ='Commercial Parking Plaza' where code='F1';
update eg_occupancy set additionaldescription ='Appurtenant Parking ' where code='F2';
update eg_occupancy set additionaldescription ='Hotels' where code='F3';
update eg_occupancy set additionaldescription ='Kiosk' where code='F4';
update eg_occupancy set additionaldescription ='G1 (Large scale)' where code='G1';
update eg_occupancy set additionaldescription ='G2 (Small Scale)' where code='G2';
update eg_occupancy set additionaldescription ='Storage -H' where code='H';
update eg_occupancy set additionaldescription ='Hazardous (I-1)' where code='I1';
update eg_occupancy set additionaldescription ='Hazardous (I-2)' where code='I2';