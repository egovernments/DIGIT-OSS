insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_LIGHT_VENTILATION','BLK_%s_FLR_%s_LIGHT_VENTILATION',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_LIGHT_VENTILATION');

 insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_VERANDAH','BLK_%s_FLR_%s_VERANDAH',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_VERANDAH');

  insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_VENTILATION_SHAFT','BLK_%s_FLR_%s_VENTILATION_SHAFT',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_VENTILATION_SHAFT');

   insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_COURTYARD_INNER','BLK_%s_FLR_%s_COURTYARD_INNER',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_COURTYARD_INNER');

   insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_COURTYARD_OUTER','BLK_%s_FLR_%s_COURTYARD_OUTER',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_COURTYARD_OUTER');

   insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_COURTYARD_SUNKEN','BLK_%s_FLR_%s_COURTYARD_SUNKEN',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_COURTYARD_SUNKEN');
