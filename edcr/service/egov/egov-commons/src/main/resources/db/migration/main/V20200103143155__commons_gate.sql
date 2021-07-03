insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_GATE','GATE',1,now(),1,now(),0 
where not exists(select key from state.egdcr_layername where key='LAYER_NAME_GATE');


INSERT INTO egdcr_sub_feature_colorcode(id, feature, subfeature, colorcode,ordernumber)
VALUES (nextval('seq_egdcr_sub_feature_colorcode'), 'Gate', 'MainGate', 1, 11);

INSERT INTO egdcr_sub_feature_colorcode(id, feature, subfeature, colorcode,ordernumber)
VALUES (nextval('seq_egdcr_sub_feature_colorcode'), 'Gate', 'WicketGate', 2, 12);

