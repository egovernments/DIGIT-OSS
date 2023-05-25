
CREATE TABLE EG_OCCUPANCY (
    id bigint NOT NULL,
    code character varying(128) NOT NULL,
    description character varying(256) NOT NULL,
    isactive boolean DEFAULT true,
    version numeric DEFAULT 0,
    createdby bigint NOT NULL,
    createddate timestamp without time zone NOT NULL,
    lastmodifiedby bigint,
    lastmodifieddate timestamp without time zone,
    occupantdoors numeric,
    noofoccupancy numeric,
    occupantload numeric,
    permissibleareainpercentage numeric,
    numoftimesareapermissible numeric,
    numoftimesareapermwitaddnlfee numeric,
    ordernumber bigint,
     CONSTRAINT pk_EG_OCCUPANCY PRIMARY KEY (id),
	 CONSTRAINT unq_EG_OCCUPANCY_code UNIQUE (code),
	 CONSTRAINT FK_EG_OCCUPANCY_MDFDBY FOREIGN KEY (lastModifiedBy)
         REFERENCES EG_USER (ID),
    CONSTRAINT FK_EG_OCCUPANCY_CRTBY FOREIGN KEY (createdBy)
         REFERENCES EG_USER (ID)
);
CREATE INDEX IDX_EG_OCCUPANCY_CODE ON EG_OCCUPANCY USING btree (code);     
   
CREATE SEQUENCE SEQ_EG_OCCUPANCY;



INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '01', 'Residential', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 65, 3, 4, 1);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '02', 'Special Residential', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 65, 2.5, 4, 2);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '03', 'Educational', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 35, 2.5, 3, 3);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '04', 'Medical/Hospital', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 60, 2.5, 3.5, 4);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '05', 'Assembly', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 40, 1.5, 2.5, 5);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '06', 'Office/Business', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 70, 3, 4, 6);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '07', 'Mercantile / Commercial', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 70, 3, 4, 7);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '08', 'Industrial', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 65, 2.5, 0, 8);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '09', 'Small Industrial', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 75, 3.5, 4, 9);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '10', 'Storage', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 80, 3, 4, 10);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '11', 'Hazardous (1)', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 45, 2, 0, 11);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '12', 'Hazardous (2)', true, 0, 1, '2018-03-22 16:20:28.057925', 1, '2018-03-22 16:20:28.057925', NULL, NULL, NULL, 40, 1.5, 0, 12);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '14', 'Thatched / Tiled House', true, 0, 1, '2018-03-22 16:20:34.631755', 1, '2018-03-22 16:20:34.631755', NULL, NULL, NULL, 65, 1, 0, 13);

INSERT INTO EG_OCCUPANCY (id, code, description, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate, occupantdoors, noofoccupancy, occupantload, permissibleareainpercentage, numoftimesareapermissible, numoftimesareapermwitaddnlfee, ordernumber) VALUES (nextval('SEQ_EG_OCCUPANCY'), '15', 'Mixed', true, 0, 1, '2018-03-22 16:20:46.44884', 1, '2018-03-22 16:20:46.44884', NULL, NULL, NULL, NULL, NULL, NULL, 14);




