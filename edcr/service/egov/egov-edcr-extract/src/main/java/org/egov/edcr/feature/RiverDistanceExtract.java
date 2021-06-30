package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.River;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RiverDistanceExtract extends FeatureExtract {

    private static final Logger LOG = Logger.getLogger(RiverDistanceExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        List<River> rivers = new ArrayList<River>();

        Map<Integer, List<BigDecimal>> distancesFromRiver = Util.extractAndMapDimensionValuesByColorCode(pl,
                layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_RIVER"));
        for (Map.Entry<Integer, List<BigDecimal>> distance : distancesFromRiver.entrySet()) {
            River river = new River();
            river.setName(String.valueOf(distance.getKey()));
            river.setColorCode(distance.getKey());
            river.setDistancesFromRiver(distance.getValue());
            rivers.add(river);
        }

        Map<Integer, List<BigDecimal>> distancesFromProtectionWall = Util.extractAndMapDimensionValuesByColorCode(pl,
                layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_RIVER_PROTECTION_WALL"));
        for (Map.Entry<Integer, List<BigDecimal>> distance : distancesFromProtectionWall.entrySet()) {
            Optional<River> existRiver = rivers.stream().filter(river -> river.getColorCode() == distance.getKey()).findAny();
            if (existRiver.isPresent()) {
                River r = existRiver.get();
                r.setDistancesFromProtectionWall(distance.getValue());
            } else {
                River river = new River();
                river.setName(String.valueOf(distance.getKey()));
                river.setColorCode(distance.getKey());
                river.setDistancesFromProtectionWall(distance.getValue());
                rivers.add(river);
            }
        }

        Map<Integer, List<BigDecimal>> distancesFromEmbankment = Util.extractAndMapDimensionValuesByColorCode(pl,
                layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_RIVER_EMBANKMENT"));
        for (Map.Entry<Integer, List<BigDecimal>> distance : distancesFromEmbankment.entrySet()) {
            Optional<River> existRiver = rivers.stream().filter(river -> river.getColorCode() == distance.getKey()).findAny();
            if (existRiver.isPresent()) {
                River r = existRiver.get();
                r.setDistancesFromEmbankment(distance.getValue());
            } else {
                River river = new River();
                river.setName(String.valueOf(distance.getKey()));
                river.setColorCode(distance.getKey());
                river.setDistancesFromEmbankment(distance.getValue());
                rivers.add(river);
            }
        }

        Map<Integer, List<BigDecimal>> distancesFromEdge = Util.extractAndMapDimensionValuesByColorCode(pl,
                layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_RIVER_EDGE"));
        for (Map.Entry<Integer, List<BigDecimal>> distance : distancesFromEdge.entrySet()) {
            Optional<River> existRiver = rivers.stream().filter(river -> river.getColorCode() == distance.getKey()).findAny();
            if (existRiver.isPresent()) {
                River r = existRiver.get();
                r.setDistancesFromRiverEdge(distance.getValue());
            } else {
                River river = new River();
                river.setName(String.valueOf(distance.getKey()));
                river.setColorCode(distance.getKey());
                river.setDistancesFromRiverEdge(distance.getValue());
                rivers.add(river);
            }
        }
        pl.getDistanceToExternalEntity().getRivers().addAll(rivers);
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
