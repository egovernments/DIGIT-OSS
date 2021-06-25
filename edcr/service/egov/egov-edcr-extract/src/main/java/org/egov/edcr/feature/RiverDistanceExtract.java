package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    public static final String MAINRIVER="MainRiver";
    public static final String  SUBRIVER="SubRiver";
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

		List<River> mainRiver = new ArrayList<River>();
		List<River> subRiver = new ArrayList<River>();
		List<River> rivers = pl.getDistanceToExternalEntity().getRivers();

		if (!rivers.isEmpty()) {
			mainRiver = rivers.stream().filter(river -> river.getName().equalsIgnoreCase(MAINRIVER))
					.collect(Collectors.toList());
			subRiver = rivers.stream().filter(river -> river.getName().equalsIgnoreCase(SUBRIVER))
					.collect(Collectors.toList());

		}

                List<BigDecimal> distancesFromProtectionWallGanga = Util.getListOfDimensionValueByLayer(pl,
                        layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_RIVER_PROTECTION_WALL_GANGA"));
                getRiverObject(pl, mainRiver, MAINRIVER).setDistancesFromProtectionWall(distancesFromProtectionWallGanga);
        
                List<BigDecimal> distancesFromEmbankmentGanga = Util.getListOfDimensionValueByLayer(pl,
                        layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_EMBANKMENT_GANGA"));
                getRiverObject(pl, mainRiver, MAINRIVER).setDistancesFromEmbankment(distancesFromEmbankmentGanga);
        
                List<BigDecimal> distancesFromEdgeGanga = Util.getListOfDimensionValueByLayer(pl,
                        layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_EDGE_GANGA"));
                getRiverObject(pl, mainRiver, MAINRIVER).setDistancesFromRiverEdge(distancesFromEdgeGanga);
        
                List<BigDecimal> distancesFromRiverNonGanga = Util.getListOfDimensionValueByLayer(pl,
                        layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_RIVER_NON_GANGA"));
                getRiverObject(pl, subRiver, SUBRIVER).setDistancesFromProtectionWall(distancesFromRiverNonGanga);

        return pl;
    }

	private River getRiverObject(PlanDetail pl, List<River> riverList, String riverType) {
		
		if(riverList.isEmpty())
		  {
			River river= new River();
			river.setName(riverType);
			riverList.add(river);
			pl.getDistanceToExternalEntity().addRivers(river);
			return river;
			  
		  }else
			 return  riverList.get(0);
	}

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
