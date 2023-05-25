update egbpa_occupancy set colorcode=6 where name='Office/Business';
update egbpa_occupancy set colorcode=7 where name='Mercantile / Commercial';
update egbpa_occupancy set colorcode=11 where name='Storage';


update egbpa_sub_occupancy set colorcode=25, code='A-R' where name='Residential';
update egbpa_sub_occupancy set colorcode=3, code='A-SR' where name='Special Residential';
update egbpa_sub_occupancy set colorcode=19, code='A-HE' where name='Hostel Educational';
update egbpa_sub_occupancy set colorcode=2, code='A-AF' where name='Apartment/Flat';
update egbpa_sub_occupancy set colorcode=24, code='A-PO' where name='Professional Office';

update egbpa_sub_occupancy set name='Primary school' where code='B1';
update egbpa_sub_occupancy set colorcode=4, code='B-PS' where name='Primary school';
update egbpa_sub_occupancy set colorcode=14, code='B-HS' where name='High school';
update egbpa_sub_occupancy set colorcode=15, code='B-HEI' where name='Higher Educational Institute';

update egbpa_sub_occupancy set colorcode=5, code='C-MIP' where name='Medical IP';
update egbpa_sub_occupancy set colorcode=20, code='C-MOP' where name='Medical OP';
update egbpa_sub_occupancy set colorcode=21, code='C-MA' where name='Medical Admin';

update egbpa_sub_occupancy set colorcode=16, code='D-AW' where name='Assembly Worship';
update egbpa_sub_occupancy set colorcode=22, code='D-BT' where name='Bus Terminal';

update egbpa_sub_occupancy set colorcode=7, code='E-OB' where name='Office/Business';

update egbpa_sub_occupancy set name='Parking Plaza' where code='F1';
update egbpa_sub_occupancy set colorcode=17, code='F-PP' where name='Parking Plaza';
update egbpa_sub_occupancy set name='Parking Appurtenant' where code='F2';
update egbpa_sub_occupancy set colorcode=18, code='F-PA' where name='Parking Appurtenant';
update egbpa_sub_occupancy set colorcode=23, code='F-H' where name='Hotels';
update egbpa_sub_occupancy set colorcode=26, code='F-K' where name='Kiosk';

update egbpa_sub_occupancy set colorcode=9, code='G-LI' where name='Large Industrial';
update egbpa_sub_occupancy set colorcode=10, code='G-SI' where name='Small Industrial';

update egbpa_sub_occupancy set code='H-S' where name='Storage';

update egbpa_sub_occupancy set colorcode=12, code='I-1' where name='Hazardous (I1)';
update egbpa_sub_occupancy set colorcode=13, code='I-2' where name='Hazardous (I2)';


update egbpa_usage set name='Single family' where code='A1-01';
update egbpa_usage set code='A-R-SF' where name='Single family';
update egbpa_usage set name='Proffessional offices part of residential' where code='A5-01';
update egbpa_usage set code='A-PO-POPOR' where name='Proffessional offices part of residential';

update egbpa_usage set code='A-AF-FR' where name='Family residential';
update egbpa_usage set code='A-AF-AH' where name='Apartment house';
update egbpa_usage set code='A-AF-RF' where name='Residential flats';
update egbpa_usage set name='Small proffessional offices or spaces' where code='A4-04';
update egbpa_usage set code='A-AF-SPOOS' where name='Small proffessional offices or spaces';

update egbpa_usage set code='A-SR-LH' where name='Lodging house';
update egbpa_usage set code='A-SR-RH' where name='Rooming house';
update egbpa_usage set code='A-SR-D' where name='Dormitory';
update egbpa_usage set code='A-SR-TH' where name='Tourist Home';
update egbpa_usage set code='A-SR-TR' where name='Tourist Resort';
update egbpa_usage set name='Hotel' where code='A2-07';
update egbpa_usage set code='A-SR-HOT' where name='Hotel';
update egbpa_usage set code='A-SR-HOS' where name='Hostel';
update egbpa_usage set code='A-SR-HWCR' where name='Hotel with conference room';
update egbpa_usage set code='A-SR-HWCHR' where name='Hotel with Community hall room';
update egbpa_usage set code='A-SR-HWDR' where name='Hotel with dining room';
update egbpa_usage set code='A-SR-HWAR' where name='Hotel with assembly room';
update egbpa_usage set code='A-SR-C' where name='Creches';
update egbpa_usage set code='A-SR-DCC' where name='Day care centres';
update egbpa_usage set code='A-SR-CN' where name='Childrens nursary';
update egbpa_usage set code='A-SR-RM' where name='reading rooms';
update egbpa_usage set name='Libraries' where code='A2-16';
update egbpa_usage set code='A-SR-LIB' where name='Libraries';
update egbpa_usage set name='Educational institution' where code='A2-17';
update egbpa_usage set code='A-SR-EI' where name='Educational institution';
delete from egbpa_usage where code='A2-18';

update egbpa_usage set code='B-PS-NS' where name='Nursary School';
update egbpa_usage set code='B-PS-PS' where name='Pre School';
update egbpa_usage set code='B-PS-LPS' where name='Lower Primary School';
update egbpa_usage set code='B-PS-UPS' where name='Upper Primary School';
update egbpa_usage set name='High School' where code='B1-05';
update egbpa_usage set code='B-PS-HS' where name='High School';

update egbpa_usage set code='B-HS-HSS' where name='Higher Secondary School';
update egbpa_usage set name='Junior Technical School' where code='B2-02';
update egbpa_usage set code='B-HS-JTS' where name='Junior Technical School';
update egbpa_usage set code='B-HEI-ITI' where name='Industrial Training Institutes';
update egbpa_usage set code='B-HEI-HEI' where name='Higher Educational Institution';
update egbpa_usage set code='B-HEI-RI' where name='Research Institute';
update egbpa_usage set code='B-HEI-EEI' where name='Engineering Education Institution';
update egbpa_usage set code='B-HEI-MHEI' where name='Medical/Health Education Institution';
update egbpa_usage set code='B-HEI-AEI' where name='Architectural Educational Institution';
update egbpa_usage set code='B-HEI-PEI' where name='Proffessional Educational Institution';

update egbpa_usage set code='C-MIP-MT' where name='C1-01';
update egbpa_usage set code='C-MIP-H' where name='C1-02';
update egbpa_usage set code='C-MIP-C' where name='C1-03';
update egbpa_usage set code='C-MIP-MH' where name='C1-04';
update egbpa_usage set code='C-MIP-SH' where name='C1-05';
update egbpa_usage set code='C-MIP-ICH' where name='C1-06';
update egbpa_usage set code='C-MIP-OACC' where name='C1-07';
update egbpa_usage set code='C-MIP-CC' where name='C1-08';
update egbpa_usage set code='C-MIP-PCC' where name='C1-09';

update egbpa_usage set code='C-MOP-MT' where name='C2-01';
update egbpa_usage set code='C-MOP-H' where name='C2-02';
update egbpa_usage set code='C-MOP-C' where name='C2-03';
update egbpa_usage set code='C-MOP-MH' where name='C2-04';
update egbpa_usage set code='C-MOP-SH' where name='C2-05';
update egbpa_usage set code='C-MOP-ICH' where name='C2-06';
update egbpa_usage set code='C-MOP-OACC' where name='C2-07';
update egbpa_usage set code='C-MOP-CC' where name='C2-08';
update egbpa_usage set code='C-MOP-PCC' where name='C2-09';

update egbpa_usage set code='C-MA-MT' where name='C3-01';
update egbpa_usage set code='C-MA-H' where name='C3-02';
update egbpa_usage set code='C-MA-C' where name='C3-03';
update egbpa_usage set code='C-MA-MH' where name='C3-04';
update egbpa_usage set code='C-MA-SH' where name='C3-05';
update egbpa_usage set code='C-MA-ICH' where name='C3-06';
update egbpa_usage set code='C-MA-OACC' where name='C3-07';
update egbpa_usage set code='C-MA-CC' where name='C3-08';
update egbpa_usage set code='C-MA-PCC' where name='C3-09';

update egbpa_usage set code='D-AW-WH' where name='Worship Hall';
update egbpa_usage set code='D-AW-RPH' where name='Religious prayer hall';
update egbpa_usage set code='D-AW-RC' where name='Religious congregation';

update egbpa_usage set code='D-BT-TT' where name='Transportation terminal';
update egbpa_usage set code='D-BT-PS' where name='Passenger stations';
update egbpa_usage set code='D-BT-TC' where name='Travel congregation';

update egbpa_usage set name='Parking Plaza' where code='F1-01';
update egbpa_usage set code='F-PP-PP' where name='Parking Plaza';
update egbpa_usage set name='Parking Appurtenant' where code='F2-01';
update egbpa_usage set code='F-PA-PA' where name='Parking Appurtenant';

update egbpa_usage set code='G-LI-WWWF' where name='Workshop without welding facility';
update egbpa_usage set code='G-LI-AP' where name='Assembly Plant';
update egbpa_usage set code='G-LI-LAB' where name='Laboratory';
update egbpa_usage set code='G-LI-DCP' where name='Dry cleaning Plant';
update egbpa_usage set code='G-LI-PP' where name='Power Plant';
update egbpa_usage set code='G-LI-PS' where name='Pumping Stataion';
update egbpa_usage set code='G-LI-SH' where name='Smoke House';
update egbpa_usage set code='G-LI-L' where name='Laundry';
update egbpa_usage set code='G-LI-GP' where name='Gas Plant';
update egbpa_usage set code='G-LI-R' where name='Refinery';
update egbpa_usage set code='G-LI-D' where name='Dairy';
update egbpa_usage set code='G-LI-SM' where name='Saw Mill';
update egbpa_usage set name='Fabricating, Assembling and Processing unit (G-LI)' where code='G1-13';
update egbpa_usage set code='G-LI-FAPU' where name='Fabricating, Assembling and Processing unit (G-LI)';

update egbpa_usage set name='Fabricating, Assembling and Processing unit (G-SI)' where code='G2-01';
update egbpa_usage set code='G-SI-FAPU' where name='Fabricating, Assembling and Processing unit (G-SI)';
update egbpa_usage set name='Poultry Farm' where code='G2-02';
update egbpa_usage set code='G-SI-PF' where name='Poultry Farm';
update egbpa_usage set name='Dairy farm' where code='G2-03';
update egbpa_usage set code='G-SI-DF' where name='Dairy farm';
update egbpa_usage set name='Kennel' where code='G2-04';
update egbpa_usage set code='G-SI-K' where name='Kennel';

update egbpa_usage set code='H-S-S' where name='Storage';
update egbpa_usage set code='H-S-SRPU' where name='Servicing/Reparing/Processing unit incidental to storage';
update egbpa_usage set code='H-S-SHELT' where name='Sheltering';
update egbpa_usage set code='H-S-SOG' where name='Storage of goods';
update egbpa_usage set code='H-S-SOM' where name='Storage of mercantiles';
update egbpa_usage set code='H-S-SOV' where name='Storage of vehicles';
update egbpa_usage set code='H-S-WARE' where name='Warehouse';
update egbpa_usage set code='H-S-FDPT' where name='Freight Depot';
update egbpa_usage set code='H-S-TSHED' where name='Transit shed';
update egbpa_usage set code='H-S-STRHOU' where name='Store house';
update egbpa_usage set code='H-S-GAR' where name='Garage 11';
update egbpa_usage set code='H-S-HNGR' where name='Hanger';
update egbpa_usage set code='H-S-GRNELVTR' where name='Grain elevator';
update egbpa_usage set code='H-S-BARN' where name='Barn';
update egbpa_usage set code='H-S-SYLO' where name='sylo';

update egbpa_usage set code='I-1-AMWS' where code='I1-01';
update egbpa_usage set code='I-1-AMSS' where name='Automobile service station';
update egbpa_usage set code='I-1-SGWRF' where name='Service garages- with repairing facility';
update egbpa_usage set code='I-1-WW' where name='Welding workshops';
update egbpa_usage set code='I-1-PVCPMU' where name='PVC pipe manufacturing unit, through injection/extrusion moulding';
update egbpa_usage set name='Not cause very adverse air and sound pollution' where code='I1-06'; -- "Building which produce effuents which does not cause very adverse environmental effects type  (Hazardous Type -I1)"
update egbpa_usage set code='I-1-NCVAASP' where name='Not cause very adverse air and sound pollution';
update egbpa_usage set name='Not cause very adverse environmental effects type' where code='I1-07'; --"Building which produce effuents which does not cause very adverse environmental effects type  (Hazardous Type -I1)"
update egbpa_usage set code='I-1-NCVAEET' where name='Not cause very adverse environmental effects type';

update egbpa_usage set code='I-2-AMWS' where code='I2-01';
update egbpa_usage set name='Highly inflammable liquids' where code='I2-02';
update egbpa_usage set code='I-2-HIGHINFLIQ' where name='Highly inflammable liquids';--"Storage and handling of hazardous and highly inflammable liquids"
update egbpa_usage set name='Highly inflammable or explosive materials other than liquids' where code='I2-03'; --"Storage and handling of hazardous and highly inflammable or explosive materials other than liquids"
update egbpa_usage set code='I-2-HIFOEMOTL' where name='Highly inflammable or explosive materials other than liquids';
update egbpa_usage set code='I-2-GBP' where name='Gas bottling plant';
update egbpa_usage set code='I-2-PADST' where name='Petrol and diesel storage tank';
update egbpa_usage set code='I-2-MOPG' where name='Manufacture of plastic goods';
update egbpa_usage set code='I-2-MOSL' where name='Manufacture of synthetic leather';
update egbpa_usage set code='I-2-MOA' where name='Manufacture of ammunition';
update egbpa_usage set code='I-2-MOE' where name='Manufacture of explosive';
update egbpa_usage set code='I-2-MOFW' where name='Manfacture of fire works';
update egbpa_usage set code='I-2-CRE' where name='Crematorium';
update egbpa_usage set code='I-2-BG' where name='Burial ground';
update egbpa_usage set code='I-2-GDY' where name='Garbage dumping yard';
update egbpa_usage set code='I-2-ABA' where name='Abattoir';
update egbpa_usage set code='I-2-STP' where name='Sewage treatment plant';
update egbpa_usage set code='I-2-SCP' where name='Stone crusher unit';
update egbpa_usage set code='I-2-AMFFS' where name='Automobile fuel filling station';
update egbpa_usage set code='I-2-CY' where name='Coal yard';
update egbpa_usage set code='I-2-WATY' where name='Wood and timber yard';
update egbpa_usage set name='Wood and timber yard with saw mill' where code='I2-20';
update egbpa_usage set code='I-2-WATYWSM' where name='Wood and timber yard with saw mill';
update egbpa_usage set name='Highly combustible type products' where code='I2-21';--"Storage/ Handling/ Manufacturing/ processing of Highly combustible type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-HCTP' where name='Highly combustible type products';
update egbpa_usage set name='Explosive type products' where code='I2-22';--"Storage/ Handling/ Manufacturing/ processing of Explosive type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-ETP' where name='Explosive type products';
update egbpa_usage set name='Corrossive type products' where code='I2-23';--"Storage/ Handling/ Manufacturing/ processing of Corrossive type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-CTP' where name='Corrossive type products';
update egbpa_usage set name='Poisonous type products' where code='I2-24';--"Storage/ Handling/ Manufacturing/ processing of Poisonous type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-PTP' where name='Poisonous type products';
update egbpa_usage set name='Irritant type products' where code='I2-25';--"Storage/ Handling/ Manufacturing/ processing of Irritant type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-ITP' where name='Irritant type products';
update egbpa_usage set name='Toxic type products' where code='I2-26';--"Storage/ Handling/ Manufacturing/ processing of toxic type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-TTP' where name='Toxic type products';
update egbpa_usage set name='Noxious type products' where code='I2-27';--"Storage/ Handling/ Manufacturing/ processing of noxious type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-NTP' where name='Noxious type products';
update egbpa_usage set name='Dust type products' where code='I2-28';--"Storage/ Handling/ Manufacturing/ processing of Producing dust type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-DTP' where name='Dust type products';
update egbpa_usage set name='Fire Works type products' where code='I2-29';--"Storage/ Handling/ Manufacturing/ processing of Fire Works type products  (Hazardous Type -I2)"
update egbpa_usage set code='I-2-FWTP' where name='Fire Works type products';