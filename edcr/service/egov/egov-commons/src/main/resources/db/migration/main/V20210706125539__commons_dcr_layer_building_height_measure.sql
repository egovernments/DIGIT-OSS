insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_BLDG_GROUND_LEVEL','BLK_%s_AVG_GROUND_LVL',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_BLDG_GROUND_LEVEL');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_BLDG_ROOF_LEVEL','BLK_%s_ROOF_LVL',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_BLDG_ROOF_LEVEL');