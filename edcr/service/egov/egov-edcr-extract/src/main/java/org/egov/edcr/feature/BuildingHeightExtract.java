package org.egov.edcr.feature;

import static org.egov.edcr.utility.DcrConstants.BUILDING_HEIGHT;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.SHORTESTDISTINACETOBUILDINGFOOTPRINT;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BuildingHeightExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(BuildingHeightExtract.class);
    public static final String UPTO = "Up To";
    public static final String DECLARED = "Declared";
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Building Height Extract......");
        extractDistanceFromBuildingToRoadEnd(pl);
        if (LOG.isInfoEnabled())
            LOG.info("End of Building Height Extract......");
        return pl;

    }

    private void extractDistanceFromBuildingToRoadEnd(PlanDetail pl) {
        for (Block block : pl.getBlocks()) {
            String layerName = String.format(layerNames.getLayerName("LAYER_NAME_MAX_HEIGHT_CAL"), block.getNumber());
            String heightSetBack = String.format(layerNames.getLayerName("LAYER_NAME_MAX_HEIGHT_CAL_SET_BACK"),
                    block.getNumber());

            List<BigDecimal> maxHeightCal = Util.getListOfDimensionValueByLayer(pl, layerName);
            if (!maxHeightCal.isEmpty())
                block.getBuilding().setDistanceFromBuildingFootPrintToRoadEnd(maxHeightCal);
            List<BigDecimal> maxHeightSetBack = Util.getListOfDimensionValueByLayer(pl, heightSetBack);
            if (!maxHeightSetBack.isEmpty())
                block.getBuilding().setDistanceFromSetBackToBuildingLine(maxHeightSetBack);
        }
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        HashMap<String, String> errors = new HashMap<>();
        if (!Util.isSmallPlot(pl))
            for (Block block : pl.getBlocks())
                if (!block.getCompletelyExisting()) {
                    if (block.getBuilding() != null && (block.getBuilding().getBuildingHeight() == null ||
                            block.getBuilding().getBuildingHeight().compareTo(BigDecimal.ZERO) <= 0)) {
                        errors.put(BUILDING_HEIGHT + block.getNumber(),
                                getLocaleMessage(OBJECTNOTDEFINED, BUILDING_HEIGHT + " for block " + block.getNumber()));
                        pl.addErrors(errors);
                    }
                    // distance from end of road to foot print is mandatory.
                    if (block.getBuilding().getDistanceFromBuildingFootPrintToRoadEnd().isEmpty()) {
                        errors.put(SHORTESTDISTINACETOBUILDINGFOOTPRINT + block.getNumber(),
                                getLocaleMessage(OBJECTNOTDEFINED,
                                        SHORTESTDISTINACETOBUILDINGFOOTPRINT + " for block " + block.getNumber()));
                        pl.addErrors(errors);
                    }
                }
        return pl;
    }

}
