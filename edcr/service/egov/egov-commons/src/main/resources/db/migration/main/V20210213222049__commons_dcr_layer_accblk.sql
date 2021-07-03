insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ACCBLK_UNIT','ACCBLK_%s_UNIT_%s',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ACCBLK_UNIT');

insert into state.egdcr_layername(id,key,value,createdby,createddate,lastmodifiedby,lastmodifieddate,version) 
select nextval('state.seq_egdcr_layername'),'LAYER_NAME_ACCBLK_DIST','ACCBLK_%s_DIST',1,now(),1,now(),0 where not exists(select key from state.egdcr_layername where key='LAYER_NAME_ACCBLK_DIST');
