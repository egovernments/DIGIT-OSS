package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Building;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.RainWaterHarvesting;
import org.egov.common.entity.edcr.RoofArea;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFCircle;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RainWaterHarvestingExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(RainWaterHarvestingExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Rain Water Harvesting Extract......");
        // Rain water harvesting Utility
        List<DXFLWPolyline> rainWaterHarvesting = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING"));
        if (rainWaterHarvesting != null && !rainWaterHarvesting.isEmpty())
            for (DXFLWPolyline pline : rainWaterHarvesting) {
                Measurement measurement = new MeasurementDetail(pline, true);
                RainWaterHarvesting rwh = new RainWaterHarvesting();
                rwh.setArea(measurement.getArea());
                rwh.setColorCode(measurement.getColorCode());
                rwh.setHeight(measurement.getHeight());
                rwh.setWidth(measurement.getWidth());
                rwh.setLength(measurement.getLength());
                rwh.setInvalidReason(measurement.getInvalidReason());
                rwh.setPresentInDxf(true);
                pl.getUtility().addRainWaterHarvest(rwh);
            }

        List<DXFCircle> rainWaterHarvestingCircle = Util.getPolyCircleByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING"));
        if (rainWaterHarvestingCircle != null && !rainWaterHarvestingCircle.isEmpty())
            for (DXFCircle pline : rainWaterHarvestingCircle) {
                RainWaterHarvesting rwh = new RainWaterHarvesting();
                rwh.setColorCode(pline.getColor());
                rwh.setRadius(BigDecimal.valueOf(pline.getRadius()));
                rwh.setPresentInDxf(true);
                pl.getUtility().addRainWaterHarvest(rwh);
            }

        if (pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING"))) {
            String tankCapacity = Util.getMtextByLayerName(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING"),
                    layerNames.getLayerName("LAYER_NAME_RWH_CAPACITY_L"));
            if (tankCapacity != null && !tankCapacity.isEmpty())
                try {
                    if (tankCapacity.contains(";")) {
                        String[] textSplit = tankCapacity.split(";");
                        int length = textSplit.length;

                        if (length >= 1) {
                            int index = length - 1;
                            tankCapacity = textSplit[index];
                            tankCapacity = tankCapacity.replaceAll("[^\\d.]", "");
                        } else
                            tankCapacity = tankCapacity.replaceAll("[^\\d.]", "");
                    } else
                        tankCapacity = tankCapacity.replaceAll("[^\\d.]", "");

                    if (!tankCapacity.isEmpty())
                        pl.getUtility().setRainWaterHarvestingTankCapacity(BigDecimal.valueOf(Double.parseDouble(tankCapacity)));

                } catch (NumberFormatException e) {
                    pl.addError(layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING"),
                            "Rain water Harwesting tank capity value contains non numeric character.");
                }
        }

        String rwhLayerPattern = layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING") + "_+\\d";

        List<String> rwhLayers = Util.getLayerNamesLike(pl.getDoc(), rwhLayerPattern);

        if (rwhLayers != null && !rwhLayers.isEmpty())
            for (String rwhLayer : rwhLayers) {
                String[] rwhLayerNameSplit = rwhLayer.split("_");
                List<DXFLWPolyline> rwhPolyLine = Util.getPolyLinesByLayer(pl.getDoc(), rwhLayer);
                List<BigDecimal> dimensionValues = Util.getListOfDimensionValueByLayer(pl, rwhLayer);

                String tankCapacity = Util.getMtextByLayerName(pl.getDoc(), rwhLayer,
                        layerNames.getLayerName("LAYER_NAME_RWH_CAPACITY_L"));
                if (tankCapacity != null && !tankCapacity.isEmpty())
                    try {
                        if (tankCapacity.contains(";")) {
                            String[] textSplit = tankCapacity.split(";");
                            int length = textSplit.length;

                            if (length >= 1) {
                                int index = length - 1;
                                tankCapacity = textSplit[index];
                                tankCapacity = tankCapacity.replaceAll("[^\\d.]", "");
                            } else
                                tankCapacity = tankCapacity.replaceAll("[^\\d.]", "");
                        } else
                            tankCapacity = tankCapacity.replaceAll("[^\\d.]", "");

                    } catch (NumberFormatException e) {
                        pl.addError(layerNames.getLayerName("LAYER_NAME_RAINWATER_HARWESTING"),
                                "Rain water Harwesting tank capity value contains non numeric character.");
                    }

                if (rwhPolyLine != null && !rwhPolyLine.isEmpty())
                    for (DXFLWPolyline pline : rwhPolyLine) {
                        Measurement measurement = new MeasurementDetail(pline, true);
                        RainWaterHarvesting rwh = new RainWaterHarvesting();
                        rwh.setNumber(Integer.valueOf(rwhLayerNameSplit[1]));
                        rwh.setArea(measurement.getArea());
                        rwh.setColorCode(measurement.getColorCode());
                        rwh.setHeight(measurement.getHeight());
                        rwh.setWidth(measurement.getWidth());
                        rwh.setLength(measurement.getLength());
                        rwh.setInvalidReason(measurement.getInvalidReason());
                        rwh.setPresentInDxf(true);
                        rwh.setTankHeight(dimensionValues);

                        if (tankCapacity != null && !tankCapacity.isEmpty())
                            rwh.setTankCapacity(BigDecimal.valueOf(Double.parseDouble(tankCapacity)));

                        pl.getUtility().addRainWaterHarvest(rwh);
                    }

                List<DXFCircle> rwhCircle = Util.getPolyCircleByLayer(pl.getDoc(), rwhLayer);
                if (rwhCircle != null && !rwhCircle.isEmpty())
                    for (DXFCircle pline : rwhCircle) {
                        RainWaterHarvesting rwh = new RainWaterHarvesting();
                        rwh.setNumber(Integer.valueOf(rwhLayerNameSplit[1]));
                        rwh.setColorCode(pline.getColor());
                        rwh.setRadius(BigDecimal.valueOf(pline.getRadius()));
                        rwh.setPresentInDxf(true);
                        rwh.setTankHeight(dimensionValues);
                        if (!tankCapacity.isEmpty())
                            rwh.setTankCapacity(BigDecimal.valueOf(Double.parseDouble(tankCapacity)));

                        pl.getUtility().addRainWaterHarvest(rwh);
                    }

            }

        for (Block block : pl.getBlocks()) {
            Building building = block.getBuilding();
            if (building != null) {
                List<Floor> floors = building.getFloors();
                if (floors != null && !floors.isEmpty())
                    for (Floor floor : floors) {
                        String roofAreaLayerName = String.format(layerNames.getLayerName("LAYER_NAME_ROOF_AREA"),
                                block.getNumber(), floor.getNumber());
                        List<DXFLWPolyline> roofAreas = Util.getPolyLinesByLayer(pl.getDoc(), roofAreaLayerName);

                        if (roofAreas != null && !roofAreas.isEmpty()) {
                            List<RoofArea> roofAreaList = new ArrayList<>();
                            for (DXFLWPolyline pline : roofAreas) {
                                Measurement measurement = new MeasurementDetail(pline, true);
                                RoofArea roofArea = new RoofArea();
                                roofArea.setArea(measurement.getArea());
                                roofArea.setColorCode(measurement.getColorCode());
                                roofArea.setHeight(measurement.getHeight());
                                roofArea.setWidth(measurement.getWidth());
                                roofArea.setLength(measurement.getLength());
                                roofArea.setInvalidReason(measurement.getInvalidReason());
                                roofArea.setPresentInDxf(true);
                                roofAreaList.add(roofArea);
                            }
                            floor.setRoofAreas(roofAreaList);
                        }
                    }
            }
        }

        if (LOG.isInfoEnabled())
            LOG.info("End of Rain Water Harvesting Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
