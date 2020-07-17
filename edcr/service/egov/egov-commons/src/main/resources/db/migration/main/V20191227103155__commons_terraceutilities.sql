insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_TERRACEUTILITY','BLK_%s_TERRACESERVICE_UTILITYDISTANCE',1,now(),1,now(),0 
where not exists(select key from state.egdcr_layername where key='LAYER_NAME_TERRACEUTILITY');


INSERT INTO egdcr_sub_feature_colorcode(id, feature, subfeature, colorcode,ordernumber)
VALUES (nextval('seq_egdcr_sub_feature_colorcode'), 'TerraceUtilitiesDistance', 'Solar water heating System', 1, 10);

INSERT INTO egdcr_sub_feature_colorcode(id, feature, subfeature, colorcode,ordernumber)
VALUES (nextval('seq_egdcr_sub_feature_colorcode'), 'TerraceUtilitiesDistance', 'Water tank', 2, 10);

INSERT INTO egdcr_sub_feature_colorcode(id, feature, subfeature, colorcode,ordernumber)
VALUES (nextval('seq_egdcr_sub_feature_colorcode'), 'TerraceUtilitiesDistance', 'Solar photo voltaic power plant', 3, 10);

INSERT INTO egdcr_sub_feature_colorcode(id, feature, subfeature, colorcode,ordernumber)
VALUES (nextval('seq_egdcr_sub_feature_colorcode'), 'TerraceUtilitiesDistance', 'Screen wall', 4, 10);
