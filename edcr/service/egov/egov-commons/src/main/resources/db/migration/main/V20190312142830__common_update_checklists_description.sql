update eg_checklist_type set description = 'Permit Dcr Document' where code='BPADCRDOCUMENTS';
update eg_checklist_type set description = 'Occupancy Certificate Plan Scrutiny Drawing' where code='OCPLANSCRUTINYDRAWING';
update eg_checklist_type set description = 'Occupancy Certificate General Documents' where code='OCGENERALDOCUMENTS';
update eg_checklist_type set description = 'Occupancy Certificate Letter To Party Documents' where code='OCLTPDOCUMENTS';
update eg_checklist_type set description = 'Occupancy Certificate Plan Scrutiny Rule' where code='OCPLANSCRUTINYRULE';
update eg_checklist_type set description = 'Occupancy Certificate Dcr Documents' where code='OCDCRDOCUMENTS';
update eg_checklist_type set description = 'Occupancy Certificate NOC' where code='OCNOC';
update eg_checklist_type set description = 'Occupancy Certificate Inspection' where code='OCINSPECTION';
update eg_checklist_type set description = 'Letter To Party' where code='LTP';
update eg_checklist_type set description = 'Height of the Building from the abutting road' where code='INSPECTIONHGTBUILDABUTROAD';
update eg_checklist set description ='Whether Front yard, Side yard 1, Side yard 2, Rear yard and plot boundary polygons are accurately marked (Plot boundaries shall be excluding the road widening area if any), 
and conditions with regards to overhangs stipulated in rules 24-10, 24-11, 62-2 are complied with?' where code='OCPLANSCRUTINYDRAWING-06';

update eg_checklist set description ='Whether the various uses/ occupancies of different spaces in the building/s as specified in the generated EDCR report for the particular application, are in accordance with 
the uses specified against different spaces specified in the uploaded  drawings in pdf format, based on occupancy classes defined as per rules and related amendments?' where code='OCPLANSCRUTINYDRAWING-03';

update eg_checklist set description ='Whether the practicality of the provided car parking, two wheeler parking, loading and unloading space, manoeuvring space, slope, maximum open yard area allowable to 
be covered by parking, width of driveway etc. are ensured with regards to provisions as per rule and related amendments?' where code='OCPLANSCRUTINYRULE-05';

update eg_checklist set description ='Whether the practicality of the provided car parking, two wheeler parking, loading and unloading space, manoeuvring space, slope, maximum open yard area allowable to 
be covered by parking, width of driveway etc. are ensured with regards to provisions as per rule and related amendments?' where code='PLANSCRUTINY-04';

update eg_checklist set description ='Whether the various uses/ occupancies of different spaces in the building/s as specified in the generated EDCR report for the particular application, are in accordance with 
the uses specified against different spaces specified in the uploaded  drawings in pdf format, based on occupancy classes defined as per rules and related amendments?' where code='PLANSCRUTINYDRAWING-03';

update eg_checklist set description ='Whether Front yard, Side yard 1, Side yard 2, Rear yard and plot boundary polygons are accurately marked (Plot boundaries shall be excluding the road widening area if any), 
and conditions with regards to overhangs stipulated in rules 24-10, 24-11, 62-2 are complied with?' where code='PLANSCRUTINYDRAWING-05';