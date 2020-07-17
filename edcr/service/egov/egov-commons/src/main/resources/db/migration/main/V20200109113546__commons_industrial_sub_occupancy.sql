INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxfar, occupancy, description,colorcode)  VALUES 
(nextval('seq_egbpa_sub_occupancy'), 'G-PHI', 'Polluting and hazardous industries', (select max(ordernumber)+1 from egbpa_sub_occupancy), 't', 1, now(), now(), 1, 0, 0.5, (select id from egbpa_occupancy where code='G'), 'Polluting and hazardous industries',33);


INSERT INTO egbpa_sub_occupancy(id, code, name, ordernumber, isactive, createdby, createddate, lastmodifieddate, lastmodifiedby, version, maxfar, occupancy, description,colorcode)  VALUES 
(nextval('seq_egbpa_sub_occupancy'), 'G-NPHI', 'Non-polluting and household industries ', (select max(ordernumber)+1 from egbpa_sub_occupancy), 't', 1, now(), now(), 1, 0, 1.5, (select id from egbpa_occupancy where code='G'), 'Non-polluting and household industries ',34);
