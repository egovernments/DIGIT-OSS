
CREATE SEQUENCE seq_eg_sub_occupancy;

create table eg_sub_occupancy
(
  id bigint NOT NULL,
  occupancy bigint NOT NULL,
  code character varying(128),
  description character varying(512),
  orderNumber bigint,
  fromarea double precision,
  toarea double precision,
  condition character varying(256),
  additionalcondition character varying(256),
  extrainfo character varying(512),
  isactive boolean,
  createdby bigint NOT NULL,
  createddate timestamp without time zone NOT NULL,
  lastmodifieddate timestamp without time zone,
  lastmodifiedby bigint,
  version numeric NOT NULL,
  CONSTRAINT pk_eg_sub_occupancy PRIMARY KEY (id),
  CONSTRAINT fk_sub_occupancy_main_occ FOREIGN KEY (occupancy)
     REFERENCES eg_occupancy (id),
  CONSTRAINT fk_eg_sub_occupancy_crtby FOREIGN KEY (createdby)
      REFERENCES eg_user (id),
  CONSTRAINT fk_eg_sub_occupancy_mdfdby FOREIGN KEY (lastmodifiedby)
      REFERENCES eg_user (id)
);


INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A1'), 'A1-01', 'Single family residential', 1, 0, 150, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A5'),'A5-01', 'Proffessional offices part of residential use with floor area less than 50 m2', 1, 0, 50, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A4'), 'A4-01', 'Family residential', 1, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A4'), 'A4-02', 'Apartment house', 2, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A4'), 'A4-03', 'Residential flats', 3, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A4'), 'A4-04', 'Small proffessional offices or spaces with less than 50m2 floor area as part of principal residential occupancy', 4, 0, 50, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-01', 'Lodging house', 1, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-02', 'Rooming house', 2, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-03', 'Dormitory', 3, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-04', 'Tourist Home', 4, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-05', 'Tourist Resort', 5, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-06', 'Hostel', 6, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-07', 'Hotel', 7, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-08', 'Hotel with conference room', 8, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-09', 'Hotel with Community hall room', 9, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-10', 'Hotel with dining room', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-11', 'Hotel with assembly room', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-12', 'Creches', 12, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-13', 'Day care centres', 13, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-14', 'Children''s nursary', 14, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-15', 'reading rooms', 15, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-16', 'Libraries not exceeding 150 m2 floor area', 16, 0, 150, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-17', 'Educational institution not exceeding 150 m2 floor area', 17, 0, 150, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='A2'), 'A2-18', 'Educational institution not exceeding 150 m2 floor area', 18, 0, 150, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B1'), 'B1-01', 'Nursary School', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B1'), 'B1-02', 'Pre School', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B1'), 'B1-03', 'Lower Primary School', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B1'), 'B1-04', 'Upper Primary School', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B1'), 'B1-05', 'High School', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B2'), 'B2-01', 'Higher Secondary School', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B2'), 'B2-02', 'Junior Technical School', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B1'), 'B2-03', 'Industrial Training Institutes', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B3'), 'B3-01', 'Higher Educational Institution', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B3'), 'B3-02', 'Research Institute', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B3'), 'B3-03', 'Engineering Education Institution', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B3'), 'B3-04', 'Medical/ Health Education Institution', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B3'), 'B3-05', 'Architectural Educational Institution', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='B3'), 'B3-06', 'Proffessional Educational Institution', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-01', 'Medical treatment', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-02', 'Hospital', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-03', 'Clinic', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-04', 'Mental Hospital', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-05', 'Speciallity Hospital', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-06', 'Infant care hospital', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-07', 'Old aged care centre', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-08', 'Convalescents centre', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C1'), 'C1-09', 'Paliative care centre', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-01', 'Medical treatment', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-02', 'Hospital', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-03', 'Clinic', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-04', 'Mental Hospital', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-05', 'Speciallity Hospital', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-06', 'Infant care hospital', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-07', 'Old aged care centre', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-08', 'Convalescents centre', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C2'), 'C2-09', 'Paliative care centre', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-01', 'Medical treatment', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-02', 'Hospital', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-03', 'Clinic', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-04', 'Mental Hospital', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-05', 'Speciallity Hospital', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-06', 'Infant care hospital', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-07', 'Old aged care centre', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-08', 'Convalescents centre', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='C3'), 'C3-09', 'Paliative care centre', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-01', 'Theatre', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-02', 'Motion pictures house', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-03', 'Cinemas', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-04', 'Assembly halls - Educational', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-05', 'Assembly halls- Drama', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-06', 'Assembly halls- theatrical presentations', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-07', 'Auditoriums', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-08', 'Wedding halls', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-09', 'Community Halls', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-10', 'Exhibition halls', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-11', 'Art galleries', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-12', 'Museums', 12, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-13', 'Libraries', 13, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-14', 'Skating rings', 14, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-15', 'Gymnasiums', 15, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-16', 'Congregation Halls', 16, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-17', 'Dance Halls', 17, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-18', 'Clubs rooms', 18, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-19', 'Prayer halls', 19, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-20', 'Recreation piers', 20, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-21', 'Amusement park structures', 21, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-22', 'Viewing stands', 22, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-23', 'Grand stands', 23, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-24', 'Stadium', 24, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-25', 'Circus tent', 25, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-26', 'Recreation pier', 26, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-27', 'Amusement park', 2, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-28', 'Amusement congragation', 28, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-29', 'Recreation congregation', 29, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-30', 'Social congregation', 30, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-31', 'Patriotric congregation', 31, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D'), 'D-32', 'Civil congregation', 32, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D1'), 'D1-01', 'Worship Hall', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D1'), 'D1-02', 'Religious prayer hall', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D1'), 'D1-03', 'Religious congregation', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D2'), 'D2-01', 'Transportation terminal', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D2'), 'D2-02', 'Passenger stations', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='D2'), 'D2-03', 'Travel congregation', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-01', 'Public business', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-02', 'Private business', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-03', 'Public Office', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-04', 'Prvate office', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-05', 'Records/ Accounts Office', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-06', 'Local Government Office', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-07', 'State Government office', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-08', 'Central Government office', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-09', 'Private sector Office', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-10', 'Quasi Government agency office', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-11', 'Defense use office', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-12', 'Court house', 12, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-13', 'Public utility building', 13, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-14', 'Jail/ Prison', 14, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-15', 'Information Technology Office', 15, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-16', 'Government owned Information Technology park', 16, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-17', 'Government approved Private Information Technology Park', 17, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-18', 'Government approved Private Information Technology Office', 18, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-19', 'Ancillary or support service to Information Technology', 19, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-20', 'Office for Information Technology Parks', 20, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-21', 'Residences for for Information Technology Parks', 21, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-22', 'Social amenities for Information Technology Park', 22, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-23', 'Recreational facilities for Information Technology Park', 23, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='E'), 'E-24', 'Commercial establishments for Information Technology Park', 24, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-01', 'Shops with display and sales of merchandise', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-02', 'Stores with display and sales of merchandise', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-03', 'Wholesale Market', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-04', 'Retail Market', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-05', 'Banking and Financial Institution', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-06', 'Public business house', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-07', 'Private business house', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-08', 'Professional Establishment - Doctor', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-09', 'Professional Establishment - Dentist', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-10', 'Professional Establishment - Engineer', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-11', 'Professional Establishment - Architect', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-12', 'Professional Establishment - Lawyer', 12, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-13', 'Pathological Laboratorie', 13, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-14', 'Tailor shop', 14, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-15', 'Video shop', 15, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-16', 'Barber shop', 16, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-17', 'Beauty Parlour', 17, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-18', 'News stand', 18, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-19', 'Milk Booth', 19, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-20', 'Armature Winding Shop, with power motor or machineof capacity not exceeding 3Hp', 20, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F'), 'F-21', 'Non nuisance type of small establishments', 21, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F1'), 'F1-01', 'Commercial Parking Plaza', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F2'), 'F2-01', 'Appurtenant Parking', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='F3'), 'F3-01', 'Restaurant', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-01', 'Workshop without welding facility', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-02', 'Assembly Plant', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-03', 'Laboratory', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-04', 'Dry cleaning Plant', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-05', 'Power Plant', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-06', 'Pumping Stataion', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-07', 'Smoke House', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-08', 'Laundry', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-09', 'Gas Plant', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-10', 'Refinery', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-11', 'Dairy', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-11', 'Saw Mill', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G1'), 'G1-11', 'Fabricating, Assembling and Processing unit (Occupancy type Type G1)', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G2'), 'G2-01', 'Fabricating, Assembling and Processing unit (Occupancy type G2)', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G2'), 'G2-02', 'Poultry Farm with more than 20 hens/ducks', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G2'), 'G2-03', 'Dairy farm with more than 6 cattle', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='G2'), 'G2-04', 'Kennel with more than 6 dogs', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-01', 'Storage', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-02', 'Servicing/ Reparing/ Processing unit incidental to storage', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-03', 'Sheltering', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-04', 'Storage of goods', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-05', 'Storage of mercantiles', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-06', 'Storage of vehicles', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-07', 'Warehouse', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-08', 'Freight Depot', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-09', 'Transit shed', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-10', 'Store house', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-11', 'Garage', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-12', 'Hanger', 12, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-13', 'Grain elevator', 13, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-14', 'Barn', 14, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='H'), 'H-15', 'sylo', 15, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-01', 'Auto mobile wash stall', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-02', 'Automobile service station', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-03', 'Service garages- with repairing facility', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-04', 'Welding workshops', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-05', 'PVC pipe manufacturing unit, through injection/extrusion moulding', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-06', 'Building which produce minor nature of air and sound pollution (Hazardous Type -I1)', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I1'), 'I1-07', 'Building which produce effuents which does not cause very adverse environmental effects type  (Hazardous Type -I1)', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-01', 'Auto mobile wash stall', 01, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-02', 'Storage and handling of hazardous and highly inflammable liquids', 02, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-03', 'Storage and handling of hazardous and highly inflammable or explosive materials other than liquids', 03, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-04', 'Gas bottling plant', 04, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-05', 'Petrol and diesel storage tank', 05, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-06', 'Manufacture of plastic goods ', 06, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-07', 'Manufacture of synthetic leather', 07, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-08', 'Manufacture of ammunition', 08, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-09', 'Manufacture of explosive', 09, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-10', 'Manfacture of fire works', 10, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-11', 'Crematorium', 11, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-12', 'Burial ground', 12, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-13', 'Garbage dumping yard', 13, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-14', 'Abattoir', 14, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-15', 'Sewage treatment plant', 15, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-16', 'Stone crusher unit', 16, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-17', 'Automobile fuel filling station', 17, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-18', 'Coal yard', 18, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-19', 'Wood and timber yard', 19, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-20', 'Wood and timber yrd with saw mill', 20, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-21', 'Storage/ Handling/ Manufacturing/ processing of Highly combustible type products  (Hazardous Type -I2)', 21, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-22', 'Storage/ Handling/ Manufacturing/ processing of Explosive type products  (Hazardous Type -I2)', 22, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-23', 'Storage/ Handling/ Manufacturing/ processing of Corrossive type products  (Hazardous Type -I2)', 23, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-24', 'Storage/ Handling/ Manufacturing/ processing of Poisonous type products  (Hazardous Type -I2)', 24, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-25', 'Storage/ Handling/ Manufacturing/ processing of Irritant type products  (Hazardous Type -I2)', 25, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-26', 'Storage/ Handling/ Manufacturing/ processing of toxic type products  (Hazardous Type -I2)', 26, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-27', 'Storage/ Handling/ Manufacturing/ processing of noxious type products  (Hazardous Type -I2)', 27, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-28', 'Storage/ Handling/ Manufacturing/ processing of Producing dust type products  (Hazardous Type -I2)', 28, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

INSERT INTO eg_sub_occupancy (id, occupancy, code, description, ordernumber, fromarea, toarea, condition, additionalcondition, extrainfo, isactive, version, createdby, createddate, lastmodifiedby, lastmodifieddate) VALUES (nextval('seq_eg_sub_occupancy'), (select id from eg_occupancy where code ='I2'), 'I2-29', 'Storage/ Handling/ Manufacturing/ processing of Fire Works type products  (Hazardous Type -I2)', 29, 0, 1000000, NULL, NULL, NULL, true, 0, 1, now(), 1, now());

