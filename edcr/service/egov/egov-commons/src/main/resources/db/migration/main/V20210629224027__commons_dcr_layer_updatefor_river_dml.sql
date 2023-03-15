update state.egdcr_layername set value = 'DISTANCE_FROM_RIVER_PROTECTION_WALL' where key = 'LAYER_NAME_DISTANCE_FROM_RIVER_PROTECTION_WALL_GANGA';

update state.egdcr_layername set value = 'DISTANCE_FROM_RIVER_EMBANKMENT' where key = 'LAYER_NAME_DISTANCE_FROM_EMBANKMENT_GANGA';

update state.egdcr_layername set value = 'DISTANCE_FROM_RIVER_EDGE' where key = 'LAYER_NAME_DISTANCE_FROM_EDGE_GANGA';

update state.egdcr_layername set value = 'DISTANCE_FROM_RIVER' where key = 'LAYER_NAME_DISTANCE_FROM_RIVER_NON_GANGA';


update state.egdcr_layername set key = 'LAYER_NAME_DISTANCE_FROM_RIVER_PROTECTION_WALL' where value = 'DISTANCE_FROM_RIVER_PROTECTION_WALL';

update state.egdcr_layername set key = 'LAYER_NAME_DISTANCE_FROM_RIVER_EMBANKMENT' where value = 'DISTANCE_FROM_RIVER_EMBANKMENT';

update state.egdcr_layername set key = 'LAYER_NAME_DISTANCE_FROM_RIVER_EDGE' where value = 'DISTANCE_FROM_RIVER_EDGE';

update state.egdcr_layername set key = 'LAYER_NAME_DISTANCE_FROM_RIVER' where value = 'DISTANCE_FROM_RIVER';