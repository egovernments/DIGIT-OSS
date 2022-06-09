package org.egov.edcr.feature;

import static org.egov.edcr.utility.DcrConstants.BUILDING_HEIGHT;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.SHORTESTDISTINACETOBUILDINGFOOTPRINT;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.edcr.entity.blackbox.BuildingDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BuildingHeightExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(BuildingHeightExtract.class);
    public static final String UPTO = "Up To";
    public static final String DECLARED = "Declared";
    private static final String MANYLINES = "Multiple Lines Defined";
    private static final String SLOPE = "SLOPE OF LINE";
    public static final String AVG_GROUND_LEVEL = "AVG_GROUND_LVL";
    public static final String ROOF_LEVEL = "ROOF_LVL";
    
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
            
            if (pl.getStrictlyValidateBldgHeightDimension()) {
                DXFDocument doc = pl.getDoc();
                /**
                 * For each block, BLK_i_ROOF_LVL is mandatory. avg ground level and avg road level to be marked. Measure the
                 * distance between roof level to avg ground level.Check whether they are parellel. Compare height provided
                 * with measured height.
                 */
                String groundLvl = String.format(layerNames.getLayerName("LAYER_NAME_BLDG_GROUND_LEVEL"), block.getNumber());
                String roofLvl = String.format(layerNames.getLayerName("LAYER_NAME_BLDG_ROOF_LEVEL"), block.getNumber());

                List<DXFLine> avgGroundLevel = Util.getLinesByLayer(doc, groundLvl);
                BuildingDetail bd = new BuildingDetail();
                try {
                    BeanUtils.copyProperties(bd, block.getBuilding());
                } catch (IllegalAccessException | InvocationTargetException e) {
                    LOG.error("Error occured while copying parent class values to child class", e);
                }
                bd.setAvgGroundLevel(avgGroundLevel);

                if (avgGroundLevel.isEmpty()) {
                    pl.getErrors().put(AVG_GROUND_LEVEL + block.getNumber(),
                            getLocaleMessage(OBJECTNOTDEFINED, "Please define the Line in layer: " + groundLvl));
                }

                // If more than one line, then throw error.
                if (!avgGroundLevel.isEmpty() && avgGroundLevel.size() > 1) {
                    pl.getErrors().put(MANYLINES + groundLvl,
                            "Multiple Lines Defined in " + groundLvl + ". Expecting single line.");
                }

                List<DXFLine> roofLevel = Util.getLinesByLayer(doc, roofLvl);
                bd.setRoofLevel(roofLevel);
                block.setBuilding(bd);
                if (roofLevel.isEmpty()) {
                    pl.getErrors().put(ROOF_LEVEL + block.getNumber(),
                            getLocaleMessage(OBJECTNOTDEFINED, "Please define the Line in layer: " + roofLvl));
                }

                if (!roofLevel.isEmpty() && roofLevel.size() > 1) {
                    pl.getErrors().put(MANYLINES + roofLvl,
                            "Multiple Lines Defined in " + roofLvl + ". Expecting single line.");
                }

                if (!roofLevel.isEmpty() && !avgGroundLevel.isEmpty()) {

                    // compare slope and check both are zero or not. If not throw error as lies are not parellel.
                    double slopeOfRoof = Util.getSlope(roofLevel.get(0).getStartPoint(), roofLevel.get(0).getEndPoint());
                    double slopeOfAvgGrndLvl = Util.getSlope(avgGroundLevel.get(0).getStartPoint(),
                            avgGroundLevel.get(0).getEndPoint());

                    LOG.info("Roof slope is ------------  : " + slopeOfRoof);
                    LOG.info("Average ground level slope is ------------  : " + slopeOfAvgGrndLvl);

                    if (BigDecimal.valueOf(slopeOfRoof).setScale(2, BigDecimal.ROUND_HALF_UP)
                            .compareTo(BigDecimal.valueOf(slopeOfAvgGrndLvl).setScale(2, BigDecimal.ROUND_HALF_UP)) != 0) {
                        pl.getErrors().put(SLOPE + roofLvl,
                                "Define same slope for " + roofLvl + " and " + groundLvl + ". Lines should be parellel.");

                    }
                    if (slopeOfRoof != 0 || slopeOfAvgGrndLvl != 0) {
                        pl.getErrors().put(SLOPE + roofLvl, "Slope of  " + roofLvl + " and " + groundLvl + " should be 0.");

                    }
                    block.getBuilding().setBuildingHeightAsMeasured(BigDecimal
                            .valueOf(roofLevel.get(0).getStartPoint().getY() - avgGroundLevel.get(0).getStartPoint().getY()));
                    LOG.info("Distance is ------------  : "
                            + (roofLevel.get(0).getStartPoint().getY() - avgGroundLevel.get(0).getStartPoint().getY()));

                }
            }
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
