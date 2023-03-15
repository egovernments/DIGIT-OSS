insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_SUPPLY_LINE','UTILITY_SUPPLY_LINE',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_SUPPLY_LINE');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_DRAIN_DISTANCE','DISTANCE_FROM_DRAIN',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_DRAIN_DISTANCE');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_FOOTPATH','FOOTPATH',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_FOOTPATH');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ROAD_RESERVE_FRONT','ROAD_RESERVE_FRONT',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ROAD_RESERVE_FRONT');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ROAD_RESERVE_REAR','ROAD_RESERVE_REAR',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ROAD_RESERVE_REAR');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ROAD_RESERVE_SIDE1','ROAD_RESERVE_SIDE1',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ROAD_RESERVE_SIDE1');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ROAD_RESERVE_SIDE2','ROAD_RESERVE_SIDE2',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ROAD_RESERVE_SIDE2');