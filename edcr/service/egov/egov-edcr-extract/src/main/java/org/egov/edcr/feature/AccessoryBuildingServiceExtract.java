package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.common.entity.edcr.AccessoryBlock;
import org.egov.common.entity.edcr.AccessoryBuilding;
import org.egov.common.entity.edcr.CulDeSacRoad;
import org.egov.common.entity.edcr.Lane;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.NonNotifiedRoad;
import org.egov.common.entity.edcr.NotifiedRoad;
import org.egov.common.entity.edcr.RoadOutput;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccessoryBuildingServiceExtract extends FeatureExtract {

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        String layerNameRegex = layerNames.getLayerName("LAYER_NAME_ACCESSORY_BUILDING") + "_+\\d";
        DXFDocument doc = pl.getDoc();
        List<String> layerNamesAccessory = Util.getLayerNamesLike(doc, layerNameRegex);
        if (!layerNamesAccessory.isEmpty())
            for (String layerName : layerNamesAccessory) {
                List<DXFLWPolyline> polyLines = Util.getPolyLinesByLayer(doc, layerName);
                if (!polyLines.isEmpty() && polyLines != null) {
                    AccessoryBlock accessoryBlock = new AccessoryBlock();

                    List<Measurement> convertedMeasurements = polyLines.stream()
                            .map(polyLine -> new MeasurementDetail(polyLine, true)).collect(Collectors.toList());

                    accessoryBlock.setMeasurements(convertedMeasurements);
                    AccessoryBuilding accessoryBuilding = new AccessoryBuilding();
                    String[] strings = layerName.split("_", 2);
                    String accBlkNo = null;
                    if (strings[1] != null && !strings[1].isEmpty())
                        accBlkNo = strings[1];

                    accessoryBlock.setNumber(accBlkNo);
                    BigDecimal totalArea = BigDecimal.ZERO;
                    for (DXFLWPolyline polyline : polyLines)
                        totalArea = totalArea.add(Util.getPolyLineArea(polyline) == null ? BigDecimal.ZERO
                                : Util.getPolyLineArea(polyline));
                    accessoryBuilding.setArea(totalArea);
                    String accessoryBlockHeightText = Util.getMtextByLayerName(doc, layerName);
                    if (accessoryBlockHeightText != null && !accessoryBlockHeightText.isEmpty()) {
                        String stringArray[] = accessoryBlockHeightText.split("=", 2);
                        if (stringArray[0] != null && !stringArray[0].isEmpty()) {
                            String text = stringArray[0].replaceAll("[^\\d.]", "");
                            if (text != null && text.equals(accessoryBlock.getNumber()) && stringArray[1] != null
                                    && !stringArray[1].isEmpty())
                                accessoryBuilding.setHeight(BigDecimal.valueOf(Double.valueOf(stringArray[1])));
                        }
                    }

                    String accBlkUnitLayerRegExp = String
                            .format(layerNames.getLayerName("LAYER_NAME_ACCBLK_UNIT"), accBlkNo, "+\\d");
                    List<String> accBlkUnitLayers = Util.getLayerNamesLike(pl.getDoc(), accBlkUnitLayerRegExp);
                    for (String unitLayer : accBlkUnitLayers) {
                        List<DXFLWPolyline> accBlkUnits = Util.getPolyLinesByLayer(pl.getDoc(), unitLayer);
                        if (!accBlkUnits.isEmpty()) {
                            List<Measurement> unitMeasurements = new ArrayList<>();
                            for (DXFLWPolyline pline : accBlkUnits) {
                                Measurement m = new MeasurementDetail(pline, true);
                                m.setName(unitLayer);
                                unitMeasurements.add(m);
                            }
                            accessoryBuilding.setUnits(unitMeasurements);
                        }
                    }

                    String accBlkDistLayerName = String.format(layerNames.getLayerName("LAYER_NAME_ACCBLK_DIST"), accBlkNo);
                    Map<Integer, List<BigDecimal>> distances = Util.extractAndMapDimensionValuesByColorCode(pl,
                            accBlkDistLayerName);
                    accessoryBuilding.setDistances(distances);
                    accessoryBlock.setAccessoryBuilding(accessoryBuilding);
                    pl.getAccessoryBlocks().add(accessoryBlock);
                }
            }
        extractDistanceOfAccessoryBlockToRoads(pl, doc);
        extractDistanceOfAccessoryBlockToPlotBoundary(pl, doc);
        return pl;
    }

    private void extractDistanceOfAccessoryBlockToPlotBoundary(PlanDetail pl, DXFDocument doc) {
        if (pl != null && !pl.getAccessoryBlocks().isEmpty())
            for (AccessoryBlock accessoryBlock : pl.getAccessoryBlocks())
                if (accessoryBlock.getNumber() != null) {
                    String accessoryBlockLayerName = String.format(
                            layerNames.getLayerName("LAYER_NAME_ACCESSORY_DIST_TO_PLOT_BNDRY"),
                            accessoryBlock.getNumber());
                    List<BigDecimal> distanceToPlotList = Util.getListOfDimensionValueByLayer(pl,
                            accessoryBlockLayerName);
                    accessoryBlock.getAccessoryBuilding().setDistanceFromPlotBoundary(distanceToPlotList);
                }
    }

    private void extractDistanceOfAccessoryBlockToRoads(PlanDetail pl, DXFDocument doc) {
        String layerAccShortestDist = layerNames.getLayerName("LAYER_NAME_ACCESSORY_SHORTEST_DISTANCE");
        List<RoadOutput> distancesWithColorCode = extractDistanceWithColourCode(pl, layerAccShortestDist);
        List<BigDecimal> notifiedRoadDistances = new ArrayList<>();
        List<BigDecimal> nonNotifiedRoadDistances = new ArrayList<>();
        List<BigDecimal> culdesacRoadDistances = new ArrayList<>();
        List<BigDecimal> laneRoadDistances = new ArrayList<>();
        for (RoadOutput dimension : distancesWithColorCode)
            if (Integer.valueOf(dimension.colourCode) == DxfFileConstants.COLOUR_CODE_NOTIFIEDROAD)
                notifiedRoadDistances.add(dimension.distance);
            else if (Integer.valueOf(dimension.colourCode) == DxfFileConstants.COLOUR_CODE_NONNOTIFIEDROAD)
                nonNotifiedRoadDistances.add(dimension.distance);
            else if (Integer.valueOf(dimension.colourCode) == DxfFileConstants.COLOUR_CODE_CULDESAC)
                culdesacRoadDistances.add(dimension.distance);
            else if (Integer.valueOf(dimension.colourCode) == DxfFileConstants.COLOUR_CODE_LANE)
                laneRoadDistances.add(dimension.distance);
        if (!notifiedRoadDistances.isEmpty() && pl.getNotifiedRoads().isEmpty()) {
            NotifiedRoad notifiedRoad = new NotifiedRoad();
            notifiedRoad.setPresentInDxf(true);
            pl.getNotifiedRoads().add(notifiedRoad);
        } else if (!nonNotifiedRoadDistances.isEmpty() && pl.getNonNotifiedRoads().isEmpty()) {
            NonNotifiedRoad nonNotifiedRoad = new NonNotifiedRoad();
            nonNotifiedRoad.setPresentInDxf(true);
            pl.getNonNotifiedRoads().add(nonNotifiedRoad);
        } else if (!culdesacRoadDistances.isEmpty() && pl.getCuldeSacRoads().isEmpty()) {
            CulDeSacRoad culDeSacRoad = new CulDeSacRoad();
            culDeSacRoad.setPresentInDxf(true);
            pl.getCuldeSacRoads().add(culDeSacRoad);
        } else if (!laneRoadDistances.isEmpty() && pl.getLaneRoads().isEmpty()) {
            Lane lane = new Lane();
            lane.setPresentInDxf(true);
            pl.getLaneRoads().add(lane);
        }
        for (BigDecimal notifiedDistance : notifiedRoadDistances)
            if (!pl.getNotifiedRoads().isEmpty())
                pl.getNotifiedRoads().get(0).addDistanceFromAccessoryBlock(notifiedDistance);
        for (BigDecimal nonNotifiedDistance : nonNotifiedRoadDistances)
            if (!pl.getNonNotifiedRoads().isEmpty())
                pl.getNonNotifiedRoads().get(0).addDistanceFromAccessoryBlock(nonNotifiedDistance);
        for (BigDecimal culdesacDistance : culdesacRoadDistances)
            if (!pl.getCuldeSacRoads().isEmpty())
                pl.getCuldeSacRoads().get(0).addDistanceFromAccessoryBlock(culdesacDistance);
        for (BigDecimal laneDistance : laneRoadDistances)
            if (!pl.getLaneRoads().isEmpty())
                pl.getLaneRoads().get(0).addDistanceFromAccessoryBlock(laneDistance);
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    private List<RoadOutput> extractDistanceWithColourCode(PlanDetail pl, String layerName) {
        List<RoadOutput> roadOutputs = new ArrayList<>();
        Map<Integer, List<BigDecimal>> distancesWithColor = Util.extractAndMapDimensionValuesByColorCode(pl, layerName);
        if (!distancesWithColor.isEmpty())
            for (Map.Entry<Integer, List<BigDecimal>> distanceByColor : distancesWithColor.entrySet()) {
                RoadOutput roadOutput = new RoadOutput();
                roadOutput.distance = distanceByColor.getValue().get(0);
                roadOutput.colourCode = String.valueOf(distanceByColor.getKey());
                roadOutputs.add(roadOutput);
            }
        return roadOutputs;
    }

}
