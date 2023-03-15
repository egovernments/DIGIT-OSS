CREATE SEQUENCE seq_egdcr_additional_feature_colorcodes;
CREATE TABLE egdcr_additional_feature_colorcodes
(
  id bigint NOT NULL,
  feature character varying(250),
  subfeature character varying(250),
  colorcode bigint,
  ordernumber bigint,
  CONSTRAINT pk_egdcr_adiitional_features_colorcodes PRIMARY KEY (id)
);

----Parking----------

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Parking', 'Special residetial with attach bath', 3, 1);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Parking', 'Special residetial without attach bath', 23, 1);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Parking', 'Special residetial with dine', 24, 1);

----Stair----------

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Stair', 'Flight length', 1, 2);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Stair', 'Flight width', 2, 2);

----Yard----------

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Yard', 'Yard dimension', 2, 3);

----Sanitation----------
INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Sanitation', 'Male water closet', 1, 4);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Sanitation', 'Female water closet', 2, 4);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Sanitation', 'Common water closet', 3, 4);

----Interior open space----------

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'InteriorOpenSpace', 'Habitable room', 4, 5);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'InteriorOpenSpace', 'Floor exterior wall', 5, 5);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'InteriorOpenSpace', 'Floor open space', 6, 5);

----Distance to road/plot boundary/well/leach pit----------

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'Notified road', 1, 6);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'Non notified road', 2, 6);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'lane', 5, 6);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'Culdesac road', 6, 6);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'Well to boundary', 7, 6);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'Well to leach pit', 8, 6);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'Distance', 'Leach pit to plot boundary', 9, 6);


----Height of room----------

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Mezzanine head room', 1, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Normal room for BCEFHI occupancies', 2, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'AC room for BCEFHI occupancies', 3, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Car and two parking room', 4, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Assembly room', 5, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Assembly AC hall', 6, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Head room beneath or above balcony', 7, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Head room in general AC room in assembly', 8, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'GeneralLac store toiler lambar cellar', 9, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Work room under industrial', 10, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Lab entrance hall canteen cloak room', 11, 7);

INSERT INTO egdcr_additional_feature_colorcodes(id, feature, subfeature, colorcode,ordernumber) VALUES (nextval('seq_egdcr_additional_feature_colorcodes'), 'HeightOfRoom', 'Store toilet room in industrial', 12, 7);