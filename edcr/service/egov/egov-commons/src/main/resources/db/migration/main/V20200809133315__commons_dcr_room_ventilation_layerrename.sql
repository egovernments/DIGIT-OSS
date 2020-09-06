insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ROOM_LIGHT_VENTILATION','BLK_%s_FLR_%s_ROOM_%s_LIGHT_VENTILATION_%s',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ROOM_LIGHT_VENTILATION');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ACROOM_LIGHT_VENTILATION','BLK_%s_FLR_%s_ACROOM_%s_LIGHT_VENTILATION_%s',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ACROOM_LIGHT_VENTILATION');

update state.egdcr_layername set value='BLK_%s_FLR_%s_REGULAR_ROOM_%s' where key='LAYER_NAME_REGULAR_ROOM';

update state.egdcr_layername set value='BLK_%s_FLR_%s_AC_ROOM_%s' where key='LAYER_NAME_AC_ROOM';
 
