UPDATE eg_bpa_buildingplan SET additionaldetails = additionaldetails::jsonb || '{"serviceType": "NEW_CONSTRUCTION","applicationType": "BUILDING_PLAN_SCRUTINY"}' where businessService in ('BPA','BPA_LOW') and additionaldetails != 'null' and NOT(additionaldetails ? 'applicationType');

UPDATE eg_bpa_buildingplan SET additionaldetails = additionaldetails::jsonb || '{"serviceType": "NEW_CONSTRUCTION","applicationType": "BUILDING_OC_PLAN_SCRUTINY"}' where businessService in ('BPA_OC') and additionaldetails != 'null' and NOT(additionaldetails ? 'applicationType');

UPDATE eg_bpa_buildingplan SET additionaldetails = '{"serviceType": "NEW_CONSTRUCTION","applicationType": "BUILDING_PLAN_SCRUTINY"}' where businessService in ('BPA','BPA_LOW') and additionaldetails = 'null';

UPDATE eg_bpa_buildingplan SET additionaldetails = '{"serviceType": "NEW_CONSTRUCTION","applicationType": "BUILDING_OC_PLAN_SCRUTINY"}' where businessService in ('BPA_OC') and additionaldetails = 'null';