package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
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
import org.kabeja.dxf.DXFBlock;
import org.kabeja.dxf.DXFConstants;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFEntity;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFMText;
import org.kabeja.dxf.helpers.StyledTextParagraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DistanceToRoadExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(DistanceToRoadExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Distance To Road Extract......");
        List<DXFLWPolyline> notifiedRoads = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_NOTIFIED_ROADS"));
        for (DXFLWPolyline roadPline : notifiedRoads) {
            Measurement measurement = new MeasurementDetail(roadPline, true);
            NotifiedRoad road = new NotifiedRoad();
            road.setArea(measurement.getArea());
            road.setColorCode(measurement.getColorCode());
            road.setHeight(measurement.getHeight());
            road.setWidth(measurement.getWidth());
            road.setLength(measurement.getLength());
            road.setInvalidReason(measurement.getInvalidReason());
            road.setPresentInDxf(true);
            pl.getNotifiedRoads().add(road);

        }
        List<DXFLWPolyline> nonNotifiedRoads = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_NON_NOTIFIED_ROAD"));
        for (DXFLWPolyline roadPline : nonNotifiedRoads) {
            Measurement measurement = new MeasurementDetail(roadPline, true);
            NonNotifiedRoad road = new NonNotifiedRoad();
            road.setArea(measurement.getArea());
            road.setColorCode(measurement.getColorCode());
            road.setHeight(measurement.getHeight());
            road.setWidth(measurement.getWidth());
            road.setLength(measurement.getLength());
            road.setInvalidReason(measurement.getInvalidReason());
            road.setPresentInDxf(true);
            pl.getNonNotifiedRoads().add(road);

        }
        List<DXFLWPolyline> culdSacRoads = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_CULD_1"));
        for (DXFLWPolyline roadPline : culdSacRoads) {
            Measurement measurement = new MeasurementDetail(roadPline, true);
            CulDeSacRoad road = new CulDeSacRoad();
            road.setArea(measurement.getArea());
            road.setColorCode(measurement.getColorCode());
            road.setHeight(measurement.getHeight());
            road.setWidth(measurement.getWidth());
            road.setLength(measurement.getLength());
            road.setInvalidReason(measurement.getInvalidReason());
            road.setPresentInDxf(true);
            pl.getCuldeSacRoads().add(road);

        }
        List<DXFLWPolyline> laneRoads = Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_LANE_1"));
        for (DXFLWPolyline roadPline : laneRoads) {
            Measurement measurement = new MeasurementDetail(roadPline, true);
            Lane lane = new Lane();
            lane.setArea(measurement.getArea());
            lane.setColorCode(measurement.getColorCode());
            lane.setHeight(measurement.getHeight());
            lane.setWidth(measurement.getWidth());
            lane.setLength(measurement.getLength());
            lane.setInvalidReason(measurement.getInvalidReason());
            lane.setPresentInDxf(true);
            pl.getLaneRoads().add(lane);

        }

        extractShortestDistanceToPlotFromRoadCenter(pl.getDoc(), pl);
        extractShortestDistanceToPlot(pl.getDoc(), pl);
        if (LOG.isInfoEnabled())
            LOG.info("End of Distance To Road Extract......");
        return pl;

    }

    private void extractShortestDistanceToPlotFromRoadCenter(DXFDocument doc, PlanDetail pl) {
        List<DXFDimension> shortestDistanceCentralLineRoadDimension = Util.getDimensionsByLayer(doc,
                layerNames.getLayerName("LAYER_NAME_DIST_CL_ROAD"));
        List<RoadOutput> shortDistainceFromCenter = new ArrayList<>();

        shortDistainceFromCenter = roadDistanceWithColourCode(doc, shortestDistanceCentralLineRoadDimension,
                shortDistainceFromCenter);

        List<BigDecimal> notifiedRoadDistance = new ArrayList<>();
        List<BigDecimal> nonNotifiedRoadDistance = new ArrayList<>();
        List<BigDecimal> culdesacRoadDistance = new ArrayList<>();
        List<BigDecimal> laneDistance = new ArrayList<>();

        for (RoadOutput roadOutput : shortDistainceFromCenter) {
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_NOTIFIEDROAD)
                notifiedRoadDistance.add(roadOutput.roadDistainceToPlot);
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_NONNOTIFIEDROAD)
                nonNotifiedRoadDistance.add(roadOutput.roadDistainceToPlot);
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_CULDESAC)
                culdesacRoadDistance.add(roadOutput.roadDistainceToPlot);
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_LANE)
                laneDistance.add(roadOutput.roadDistainceToPlot);
        }

        prepareRoadDetails(pl, notifiedRoadDistance, nonNotifiedRoadDistance, culdesacRoadDistance, laneDistance,
                layerNames.getLayerName("LAYER_NAME_DIST_CL_ROAD"));
    }

    private void prepareRoadDetails(PlanDetail pl, List<BigDecimal> notifiedRoadDistance,
            List<BigDecimal> nonNotifiedRoadDistance, List<BigDecimal> culdesacRoadDistance,
            List<BigDecimal> laneDistance, String type) {

        if (!notifiedRoadDistance.isEmpty() && pl.getNotifiedRoads().isEmpty()) {
            NotifiedRoad road = new NotifiedRoad();
            road.setPresentInDxf(true);
            pl.getNotifiedRoads().add(road);
        }
        if (!nonNotifiedRoadDistance.isEmpty() && pl.getNonNotifiedRoads().isEmpty()) {
            NonNotifiedRoad road = new NonNotifiedRoad();
            road.setPresentInDxf(true);
            pl.getNonNotifiedRoads().add(road);
        }
        if (!culdesacRoadDistance.isEmpty() && pl.getCuldeSacRoads().isEmpty()) {
            CulDeSacRoad road = new CulDeSacRoad();
            road.setPresentInDxf(true);
            pl.getCuldeSacRoads().add(road);
        }
        if (!laneDistance.isEmpty() && pl.getLaneRoads().isEmpty()) {
            Lane road = new Lane();
            road.setPresentInDxf(true);
            pl.getLaneRoads().add(road);
        }
        // Adding multiple road distances into single notified road/non notified
        // road/culdesac/lane road.
        for (BigDecimal notifyRoadDistnce : notifiedRoadDistance)
            if (!pl.getNotifiedRoads().isEmpty())
                if (layerNames.getLayerName("LAYER_NAME_SHORTEST_DISTANCE_TO_ROAD").equalsIgnoreCase(type))
                    pl.getNotifiedRoads().get(0).addShortestDistanceToRoad(notifyRoadDistnce);
                else
                    pl.getNotifiedRoads().get(0).addDistancesFromCenterToPlot(notifyRoadDistnce);
        for (BigDecimal nonNotifyRoadDistnce : nonNotifiedRoadDistance)
            if (!pl.getNonNotifiedRoads().isEmpty())
                if (layerNames.getLayerName("LAYER_NAME_SHORTEST_DISTANCE_TO_ROAD").equalsIgnoreCase(type))
                    pl.getNonNotifiedRoads().get(0).addShortestDistanceToRoad(nonNotifyRoadDistnce);
                else
                    pl.getNonNotifiedRoads().get(0).addDistancesFromCenterToPlot(nonNotifyRoadDistnce);
        for (BigDecimal culdesacRdDistance : culdesacRoadDistance)
            if (!pl.getCuldeSacRoads().isEmpty())
                if (layerNames.getLayerName("LAYER_NAME_SHORTEST_DISTANCE_TO_ROAD").equalsIgnoreCase(type))
                    pl.getCuldeSacRoads().get(0).addShortestDistanceToRoad(culdesacRdDistance);
                else
                    pl.getCuldeSacRoads().get(0).addDistancesFromCenterToPlot(culdesacRdDistance);
        for (BigDecimal laneDistnce : laneDistance)
            if (!pl.getLaneRoads().isEmpty())
                if (layerNames.getLayerName("LAYER_NAME_SHORTEST_DISTANCE_TO_ROAD").equalsIgnoreCase(type))
                    pl.getLaneRoads().get(0).addShortestDistanceToRoad(laneDistnce);
                else
                    pl.getLaneRoads().get(0).addDistancesFromCenterToPlot(laneDistnce);
    }

    private void extractShortestDistanceToPlot(DXFDocument doc, PlanDetail pl) {
        List<DXFDimension> shortestDistanceDimension = Util.getDimensionsByLayer(doc,
                layerNames.getLayerName("LAYER_NAME_SHORTEST_DISTANCE_TO_ROAD"));
        List<RoadOutput> shortDistaineToPlot = new ArrayList<>();

        shortDistaineToPlot = roadDistanceWithColourCode(doc, shortestDistanceDimension, shortDistaineToPlot);

        List<BigDecimal> notifiedRoadDistance = new ArrayList<>();
        List<BigDecimal> nonNotifiedRoadDistance = new ArrayList<>();
        List<BigDecimal> culdesacRoadDistance = new ArrayList<>();
        List<BigDecimal> laneDistance = new ArrayList<>();

        for (RoadOutput roadOutput : shortDistaineToPlot) {
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_NOTIFIEDROAD)
                notifiedRoadDistance.add(roadOutput.roadDistainceToPlot);
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_NONNOTIFIEDROAD)
                nonNotifiedRoadDistance.add(roadOutput.roadDistainceToPlot);
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_CULDESAC)
                culdesacRoadDistance.add(roadOutput.roadDistainceToPlot);
            if (Integer.valueOf(roadOutput.colourCode) == DxfFileConstants.COLOUR_CODE_LANE)
                laneDistance.add(roadOutput.roadDistainceToPlot);
        }

        prepareRoadDetails(pl, notifiedRoadDistance, nonNotifiedRoadDistance, culdesacRoadDistance, laneDistance,
                layerNames.getLayerName("LAYER_NAME_SHORTEST_DISTANCE_TO_ROAD"));
    }

    private List<RoadOutput> roadDistanceWithColourCode(DXFDocument doc,
            List<DXFDimension> shortestDistanceCentralLineRoadDimension, List<RoadOutput> clcolourCodeWithDimension) {
        if (shortestDistanceCentralLineRoadDimension != null && !shortestDistanceCentralLineRoadDimension.isEmpty())
            for (Object dxfEntity : shortestDistanceCentralLineRoadDimension) {
                BigDecimal value;

                DXFDimension line = (DXFDimension) dxfEntity;
                String dimensionBlock = line.getDimensionBlock();
                DXFBlock dxfBlock = doc.getDXFBlock(dimensionBlock);
                Iterator dxfEntitiesIterator = dxfBlock.getDXFEntitiesIterator();
                while (dxfEntitiesIterator.hasNext()) {
                    DXFEntity e = (DXFEntity) dxfEntitiesIterator.next();
                    if (e.getType().equals(DXFConstants.ENTITY_TYPE_MTEXT)) {
                        DXFMText text = (DXFMText) e;
                        String text2 = text.getText();

                        Iterator styledParagraphIterator = text.getTextDocument().getStyledParagraphIterator();

                        while (styledParagraphIterator.hasNext()) {
                            StyledTextParagraph next = (StyledTextParagraph) styledParagraphIterator.next();
                            text2 = next.getText();
                        }

                        if (text2.contains(";")) {
                            String[] textSplit = text2.split(";");
                            int length = textSplit.length;

                            if (length >= 1) {
                                int index = length - 1;
                                text2 = textSplit[index];
                                text2 = text2.replaceAll("[^\\d.]", "");
                            } else
                                text2 = text2.replaceAll("[^\\d.]", "");
                        } else
                            text2 = text2.replaceAll("[^\\d.]", "");

                        if (!text2.isEmpty()) {
                            value = BigDecimal.valueOf(Double.parseDouble(text2));
                            RoadOutput roadOutput = new RoadOutput();
                            roadOutput.roadDistainceToPlot = value;
                            roadOutput.colourCode = String.valueOf(line.getColor());
                            clcolourCodeWithDimension.add(roadOutput);
                        }

                    }
                }

            }
        return clcolourCodeWithDimension;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
