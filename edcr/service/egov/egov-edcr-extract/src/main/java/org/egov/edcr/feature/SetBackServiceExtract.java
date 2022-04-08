package org.egov.edcr.feature;

import static org.egov.edcr.utility.DcrConstants.MORETHANONEPOLYLINEDEFINED;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.SetBack;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.entity.blackbox.YardDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.MinDistance;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SetBackServiceExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(SetBackServiceExtract.class);
    @Autowired
    private LayerNames layerNames;
    @Autowired
    private MinDistance minDistance;

    public static String ERR_MIN_DISTANCE = "Minimum distance is not defined in layer %s";
    
    @Override
    public PlanDetail extract(PlanDetail pl) {
        extractSetBack(pl, pl.getDoc());
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    private void extractSetBack(PlanDetail pl, DXFDocument doc) {
        LOG.info("Starting set back Extract......");
        String yardName;
        // VALIDATION : CHECK NUMBER OF BLOCKS and floors. Check block height provided ?
        // Check whether level defined ? if yes, then check level height is correct
        // format ?
        // check whether for each block setback defined ?
        // side/front/front yard.. Not necessary to define level for all the side.. if
        // any one side define also.. we need to
        // consider
        // Each block combine multiple occupancies to decide the most restrictive
        // occupancy.
        // if height is more than building height in the level. if more than one level,
        // then height is mandatory from 1st level.
        // It should be greater than previous level.
        // they may or may not define yards in that case ..?? throw error ? required
        // only other than level cases.
        // if all levels not defined, then how to using building height ?
        // extract NOC Details and opening above 2.1mt etc.

        for (Block block : pl.getBlocks()) {
            LOG.info("Block....   " + block.getName());

            // extractBasementFootPrint(doc, block);

            // based on foot prints provided, set back will be decide in general rule.
            for (SetBack setBack : block.getSetBacks())
                if (setBack.getLevel() < 0)
                    extractBasementSetBacks(pl, doc, block, setBack);
                else {
                    yardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getName() + "_"
                            + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                            + layerNames.getLayerName("LAYER_NAME_FRONT_YARD");
                    setFrontYardDetails(pl, doc, setBack, yardName);
                    yardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getName() + "_"
                            + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                            + layerNames.getLayerName("LAYER_NAME_REAR_YARD");
                    setRearYardDetails(pl, doc, setBack, yardName);
                    yardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getName() + "_"
                            + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                            + layerNames.getLayerName("LAYER_NAME_SIDE_YARD_1");
                    setSideYard1Details(pl, doc, setBack, yardName);
                    yardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getName() + "_"
                            + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                            + layerNames.getLayerName("LAYER_NAME_SIDE_YARD_2");
                    setSideYard2Details(pl, doc, yardName, setBack);
                }
        }
        pl.sortBlockByName();
        pl.sortSetBacksByLevel();
        LOG.info("End of set back Extract......");

    }

    private void setSideYard2Details(PlanDetail pl, DXFDocument doc, String yardName, SetBack setBack) {
        boolean layerPresent;
        layerPresent = doc.containsDXFLayer(yardName);

        if (layerPresent) {
            YardDetail yard = getYard(pl, doc, yardName, setBack.getLevel());
            if (yard != null && yard.getPolyLine() != null) {
                setBack.setSideYard2(yard);
                if (pl.getDrawingPreference() != null &&
                        org.egov.infra.utils.StringUtils.isNotBlank(pl.getDrawingPreference().getUom())
                        && (DxfFileConstants.INCH_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom())
                                || DxfFileConstants.FEET_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom()))) {
                    List<BigDecimal> yardWidthDistance = Util.getListOfDimensionByColourCode(pl, yardName,
                            DxfFileConstants.YARD_DIMENSION_COLOR);
                    if (!yardWidthDistance.isEmpty()) {
                        yard.setMinimumDistance(Collections.min(yardWidthDistance));
                    } else {
                        pl.addError(yardName + "_MIN_DISTANCE", String.format(ERR_MIN_DISTANCE, yardName));
                    }
                } else {
                    yard.setMinimumDistance(
                            minDistance.getYardMinDistance(pl, yardName, String.valueOf(setBack.getLevel()), doc));
                }
                setYardHeight(doc, yardName, yard);
            }
        }
    }

    private void setYardHeight(DXFDocument doc, String yardName, YardDetail yard) {
        String height = Util.getMtextByLayerName(doc, yardName, "");// change this api to get by using layer name and
                                                                    // text.
        if (height != null) {
            if (height.contains("="))
                height = height.split("=")[1] != null ? height.split("=")[1].replaceAll("[^\\d.]", "") : "";
            else
                height = height.replaceAll("[^\\d.]", "");

            if (!height.isEmpty())
                yard.setHeight(BigDecimal.valueOf(Double.parseDouble(height)));
        }
    }

    private YardDetail getYard(PlanDetail pl, DXFDocument doc, String yardName, Integer level) {
        YardDetail yard = new YardDetail();
        List<DXFLWPolyline> frontYardLines = Util.getPolyLinesByLayer(doc, yardName);

        // VALIDATE WHETHER ONE SINGLE POLYLINE PRESENT.
        if (frontYardLines != null && frontYardLines.size() > 1)
            pl.addError("", edcrMessageSource.getMessage(MORETHANONEPOLYLINEDEFINED, new String[] { yardName }, null));
        else if (frontYardLines != null && !frontYardLines.isEmpty()) {
            yard.setPolyLine(frontYardLines.get(0));
            yard.setArea(Util.getPolyLineArea(yard.getPolyLine()));
            yard.setPresentInDxf(true);
            yard.setLevel(level);

        }
        return yard;

    }

        private void extractBasementSetBacks(PlanDetail pl, DXFDocument doc, Block block, SetBack setBack) {
                String bsmntYardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                                + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                                + layerNames.getLayerName("LAYER_NAME_BSMNT_FRONT_YARD");
                setFrontYardDetails(pl, doc, setBack, bsmntYardName);
                bsmntYardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                                + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                                + layerNames.getLayerName("LAYER_NAME_BSMNT_REAR_YARD");
                setRearYardDetails(pl, doc, setBack, bsmntYardName);
                bsmntYardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                                + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                                + layerNames.getLayerName("LAYER_NAME_BSMNT_SIDE_YARD_1");
                setSideYard1Details(pl, doc, setBack, bsmntYardName);
                bsmntYardName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                                + layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + setBack.getLevel() + "_"
                                + layerNames.getLayerName("LAYER_NAME_BSMNT_SIDE_YARD_2");
                setSideYard2Details(pl, doc, bsmntYardName, setBack);
        }

    private void setSideYard1Details(PlanDetail pl, DXFDocument doc, SetBack setBack, String yardName) {
        boolean layerPresent;
        layerPresent = doc.containsDXFLayer(yardName);
        if (layerPresent) {
            YardDetail sideYard1 = getYard(pl, doc, yardName, setBack.getLevel());
            if (sideYard1 != null && sideYard1.getPolyLine() != null) {
                setBack.setSideYard1(sideYard1);
                if (pl.getDrawingPreference() != null &&
                        org.egov.infra.utils.StringUtils.isNotBlank(pl.getDrawingPreference().getUom())
                        && (DxfFileConstants.INCH_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom())
                                || DxfFileConstants.FEET_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom()))) {
                    List<BigDecimal> yardWidthDistance = Util.getListOfDimensionByColourCode(pl, yardName,
                            DxfFileConstants.YARD_DIMENSION_COLOR);
                    if (!yardWidthDistance.isEmpty()) {
                        sideYard1.setMinimumDistance(Collections.min(yardWidthDistance));
                    } else {
                        pl.addError(yardName + "_MIN_DISTANCE", String.format(ERR_MIN_DISTANCE, yardName));
                    }
                } else {
                    sideYard1.setMinimumDistance(
                            minDistance.getYardMinDistance(pl, yardName, String.valueOf(setBack.getLevel()), doc));
                }
                setYardHeight(doc, yardName, sideYard1);
            } 
        }
    }

    private void yardNotDefined(PlanDetail pl, String yardName) {
        pl.addError("", edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { yardName }, null));
    }

    private void setRearYardDetails(PlanDetail pl, DXFDocument doc, SetBack setBack, String yardName) {
        boolean layerPresent;
        layerPresent = doc.containsDXFLayer(yardName);
        if (layerPresent) {
            YardDetail rearYard = getYard(pl, doc, yardName, setBack.getLevel());
            if (rearYard != null && rearYard.getPolyLine() != null) {
                setBack.setRearYard(rearYard);
                if (pl.getDrawingPreference() != null &&
                        org.egov.infra.utils.StringUtils.isNotBlank(pl.getDrawingPreference().getUom())
                        && (DxfFileConstants.INCH_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom())
                                || DxfFileConstants.FEET_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom()))) {
                    List<BigDecimal> yardWidthDistance = Util.getListOfDimensionByColourCode(pl, yardName,
                            DxfFileConstants.YARD_DIMENSION_COLOR);
                    if (!yardWidthDistance.isEmpty()) {
                        rearYard.setMinimumDistance(Collections.min(yardWidthDistance));
                    } else {
                        pl.addError(yardName + "_MIN_DISTANCE", String.format(ERR_MIN_DISTANCE, yardName));
                    }
                } else {
                    rearYard.setMinimumDistance(
                            minDistance.getYardMinDistance(pl, yardName, String.valueOf(setBack.getLevel()), doc));
                }
                setYardHeight(doc, yardName, rearYard);
            }
        }
    }

    private void setFrontYardDetails(PlanDetail pl, DXFDocument doc, SetBack setBack, String yardName) {
        boolean layerPresent = doc.containsDXFLayer(yardName);
        if (layerPresent) {
            YardDetail frontYard = getYard(pl, doc, yardName, setBack.getLevel());
            if (frontYard != null && frontYard.getPolyLine() != null) {
                setBack.setFrontYard(frontYard);
                if (pl.getDrawingPreference() != null &&
                        org.egov.infra.utils.StringUtils.isNotBlank(pl.getDrawingPreference().getUom())
                        && (DxfFileConstants.INCH_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom())
                                || DxfFileConstants.FEET_UOM.equalsIgnoreCase(pl.getDrawingPreference().getUom()))) {
                    List<BigDecimal> yardWidthDistance = Util.getListOfDimensionByColourCode(pl, yardName,
                            DxfFileConstants.YARD_DIMENSION_COLOR);
                    if (!yardWidthDistance.isEmpty()) {
                        frontYard.setMinimumDistance(Collections.min(yardWidthDistance));
                    } else {
                        pl.addError(yardName + "_MIN_DISTANCE", String.format(ERR_MIN_DISTANCE, yardName));
                    }
                } else {
                    frontYard.setMinimumDistance(
                            minDistance.getYardMinDistance(pl, yardName, String.valueOf(setBack.getLevel()), doc));
                }
                setYardHeight(doc, yardName, frontYard);
            } else
                yardNotDefined(pl, yardName);
        }
    }
    
}
