package org.egov.edcr.utility;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.SetBack;
import org.egov.common.entity.edcr.Yard;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.entity.blackbox.PlotDetail;
import org.egov.edcr.entity.blackbox.YardDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLine;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.kabeja.math.MathUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MinDistance {

    @Autowired
    private LayerNames layerNames;
    private static final Logger LOG = LogManager.getLogger(MinDistance.class);

    public BigDecimal getYardMinDistance(PlanDetail pl, String name, String level, DXFDocument doc) {
        DXFLWPolyline plotBoundary = ((PlotDetail) pl.getPlot()).getPolyLine();

        DXFLWPolyline yardPolyline = null;
        String[] split = name.split("_");
        Block blockByName = pl.getBlockByName(split[1]);
        SetBack setBackByLevel = blockByName.getSetBackByLevel(level);
        // PrintUtil.print(buildFoorPrint,"buildFoorPrint");

        DXFLWPolyline buildFoorPrint = ((MeasurementDetail) setBackByLevel.getBuildingFootPrint()).getPolyLine();
        Yard yard = null;
        if (name.contains(layerNames.getLayerName("LAYER_NAME_FRONT_YARD"))
                || name.contains(layerNames.getLayerName("LAYER_NAME_BSMNT_FRONT_YARD"))) {
            yard = setBackByLevel.getFrontYard();
            yardPolyline = ((YardDetail) setBackByLevel.getFrontYard()).getPolyLine();
        } else if (name.contains(layerNames.getLayerName("LAYER_NAME_REAR_YARD"))
                || name.contains(layerNames.getLayerName("LAYER_NAME_BSMNT_REAR_YARD"))) {
            yard = setBackByLevel.getRearYard();
            yardPolyline = ((YardDetail) setBackByLevel.getRearYard()).getPolyLine();
        } else if (name.contains(layerNames.getLayerName("LAYER_NAME_SIDE_YARD_1"))
                || name.contains(layerNames.getLayerName("LAYER_NAME_BSMNT_SIDE_YARD_1"))) {
            yard = setBackByLevel.getSideYard1();
            yardPolyline = ((YardDetail) setBackByLevel.getSideYard1()).getPolyLine();
        } else if (name.contains(layerNames.getLayerName("LAYER_NAME_SIDE_YARD_2"))
                || name.contains(layerNames.getLayerName("LAYER_NAME_BSMNT_SIDE_YARD_2"))) {
            yard = setBackByLevel.getSideYard2();
            yardPolyline = ((YardDetail) setBackByLevel.getSideYard2()).getPolyLine();
        }
        LOG.info("yard Area  " + yard.getArea());

        if (level.equals(-1) && (plotBoundary == null || buildFoorPrint == null || yard == null)) {
            pl.getErrors().put("Set back calculation Error",
                    "Either" + layerNames.getLayerName("LAYER_NAME_BSMNT_FOOT_PRINT") + ","
                            + layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY") + " or " + name + " is not found");
            return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);
        } else if (plotBoundary == null || buildFoorPrint == null || yard == null) {
            pl.getErrors().put("Set back calculation Error",
                    "Either " + layerNames.getLayerName("LAYER_NAME_BUILDING_FOOT_PRINT") + ","
                            + layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY") + " or " + name
                            + " is not found at level " + split[3]);
            return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);
        }

        if (level.equals(-1) && (plotBoundary == null || buildFoorPrint == null || yardPolyline == null)) {
            pl.getErrors().put("Set back calculation Error",
                    "Either " + layerNames.getLayerName("LAYER_NAME_BSMNT_FOOT_PRINT") + ","
                            + layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY") + " or " + name + " is not found ");
            return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);
        } else if (plotBoundary == null || buildFoorPrint == null || yardPolyline == null) {
            pl.getErrors().put("Set back calculation Error",
                    "Either " + layerNames.getLayerName("LAYER_NAME_BUILDING_FOOT_PRINT") + ","
                            + layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY") + " or " + name + " is not found ");
            return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);
        }

        LOG.info(" ===============================");
        LOG.info(" YARD TYPE  " + name);
        LOG.info("Bounds Width " + yardPolyline.getBounds().getWidth());
        LOG.info("Bounds Height " + yardPolyline.getBounds().getHeight());
        LOG.info("Bounds Max x " + yardPolyline.getBounds().getMaximumX());
        LOG.info("Bounds Min x " + yardPolyline.getBounds().getMinimumX());

        LOG.info("Bounds Max y " + yardPolyline.getBounds().getMaximumY());
        LOG.info("Bounds Min y " + yardPolyline.getBounds().getMinimumY());

        if (!plotBoundary.isClosed())
            pl.getErrors().put("Plot boundary not closed",
                    layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY") + " is not closed ");

        if (level.equals(-1) && !buildFoorPrint.isClosed())
            pl.getErrors().put("Building basement foot print not closed",
                    layerNames.getLayerName("LAYER_NAME_BSMNT_FOOT_PRINT") + " is not closed ");
        else if (!buildFoorPrint.isClosed())
            pl.getErrors().put("Building foot print not closed",
                    layerNames.getLayerName("LAYER_NAME_BUILDING_FOOT_PRINT") + " is not closed ");

        if (!yardPolyline.isClosed())
            pl.getErrors().put(name + " not closed", name + " is not closed ");

        if (!plotBoundary.isClosed() || !buildFoorPrint.isClosed() || !yardPolyline.isClosed())
            return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);

        Iterator yardVertexIterator = yardPolyline.getVertexIterator();
        PrintUtil.print(yardPolyline, name);
        List<Point> yardOutSidePoints = new ArrayList<>();
        List<Point> yardInSidePoints = new ArrayList<>();
        Set<Double> distanceList = new TreeSet<>();
        // Find the edges of PlotBoundary
        List<Point> plotBoundaryEdges = Util.pointsOnPolygon(plotBoundary);
        // Find the points connecting the edges of PlotBoundary
        List<Point> pointsOnPlot = Util.findPointsOnPolylines(plotBoundaryEdges);

        List<Point> footPrintEdges = Util.pointsOnPolygon(buildFoorPrint);
        // Find the points connecting the edges of PlotBoundary
        List<Point> footPrintPoints = Util.findPointsOnPolylines(footPrintEdges);
        List<DXFLine> yardLines = getLinesOfPolyline(yardPolyline);

        while (yardVertexIterator.hasNext()) {
            DXFVertex next = (DXFVertex) yardVertexIterator.next();
            Point yardEdge = next.getPoint();
            PrintUtil.print(yardEdge, "yardEdge");

            Iterator plotBIterator = plotBoundary.getVertexIterator();

            // Vertex and coordinates of Polyline
            boolean pointAdded = false;
            outside: while (plotBIterator.hasNext()) {

                DXFVertex dxfVertex = (DXFVertex) plotBIterator.next();
                Point plotBoundaryEdge = dxfVertex.getPoint();
                // Util.print(plotBoundaryEdge,"plotBoundaryEdge");

                if (Util.pointsEquals(plotBoundaryEdge, yardEdge)) {
                    pointAdded = true;
                    yardOutSidePoints.add(yardEdge);
                    LOG.debug("Adding yardEdge to outside points in direct compare");
                    break outside;
                }

                if (Util.pointsEqualsWith2PercentError(plotBoundaryEdge, yardEdge)) {
                    pointAdded = true;
                    yardOutSidePoints.add(yardEdge);
                    LOG.debug("Adding yardEdge to outside points in  pointsEqualsWith2PercentError compare");
                    break outside;
                }
            }

            if (!pointAdded && pointsOnPlot.contains(yardEdge)) {
                yardOutSidePoints.add(yardEdge);
                LOG.debug("Adding yardEdge to outside points in  Contains compare");
                pointAdded = true;
            }

            if (!pointAdded)
                for (Point p : pointsOnPlot)
                    if (Util.pointsEquals(p, yardEdge)) {
                        yardOutSidePoints.add(yardEdge);
                        LOG.debug("Adding yardEdge to outside points in  pointsOnPlot pointsEquals");
                        pointAdded = true;
                        break;
                    }

            if (!pointAdded)
                for (Point p : pointsOnPlot)
                    if (Util.pointsEqualsWith2PercentError(p, yardEdge)) {

                        yardOutSidePoints.add(yardEdge);
                        LOG.debug("Adding yardEdge to outside points in  pointsOnPlot pointsEqualsWith2PercentError");
                        pointAdded = true;
                        break;
                    }

            Boolean insidePointAdded = false;
            Iterator footPrintIterator = buildFoorPrint.getVertexIterator();

            // Vertex and coordinates of Polyline
            inside: while (footPrintIterator.hasNext()) {

                DXFVertex dxfVertex = (DXFVertex) footPrintIterator.next();
                Point footPrintEdge = dxfVertex.getPoint();
                // Util.print(footPrintEdge,"footPrintEdge");
                if (Util.pointsEquals(footPrintEdge, yardEdge)) {
                    insidePointAdded = true;
                    yardInSidePoints.add(yardEdge);
                    LOG.debug("Adding yardEdge to inside points in  footPrintEdge pointsEquals");
                    break inside;
                }
                // if(LOG.isDebugEnabled()) LOG.debug("Foot Print
                // :"+point1.getX()+","+point1.getY());
                if (Util.pointsEqualsWith2PercentError(footPrintEdge, yardEdge)) {
                    yardInSidePoints.add(yardEdge);
                    insidePointAdded = true;
                    LOG.debug("Adding yardEdge to inside points in  footPrintEdge pointsEquals");
                    break inside;
                }

            }
            // Now check yard edge on the plot points

            if (!insidePointAdded && footPrintPoints.contains(yardEdge)) {
                yardInSidePoints.add(yardEdge);
                insidePointAdded = true;
                LOG.debug("Adding yardEdge to inside points in  footPrint contains");
            }
            if (!insidePointAdded)
                for (Point p : footPrintPoints)
                    if (Util.pointsEquals(p, yardEdge)) {
                        yardInSidePoints.add(yardEdge);
                        insidePointAdded = true;
                        LOG.debug("Adding yardEdge to inside points in  footPrint pointsEquals");
                        break;
                    }

            if (!insidePointAdded)
                for (Point p : footPrintPoints)
                    if (Util.pointsEqualsWith2PercentError(p, yardEdge)) {

                        yardInSidePoints.add(yardEdge);
                        insidePointAdded = true;
                        LOG.debug("Adding yardEdge to inside points in  footPrint pointsEqualsWith2PercentError");
                        break;
                    }

        }
        PrintUtil.print(yardOutSidePoints, "yardOutSidePoints");
        PrintUtil.print(yardInSidePoints, "yardInSidePoints");
        removeDuplicates(yardOutSidePoints, yardInSidePoints);
        PrintUtil.print(yardOutSidePoints, "yardOutSidePoints");
        PrintUtil.print(yardInSidePoints, "yardInSidePoints");

        List<BigDecimal> yardWidthDistance = Util.getListOfDimensionByColourCode(pl, name,
                DxfFileConstants.YARD_DIMENSION_COLOR);
        // if yard dimension defined in plan, then use the same other wise calculate
        // manually.
        if (!yardWidthDistance.isEmpty()) {
            Collections.min(yardWidthDistance);

            yard.setMinimumDistance(Collections.min(yardWidthDistance));
            /*
             * if (minDistance.compareTo(BigDecimal.ZERO) > 0 && yard.getArea() != null) //
             * yard1.setMean(yard1.getArea().divide(maxDistance, 2, RoundingMode.HALF_UP));
             * yard.setMean(yard.getArea().divide(minDistance, 2, RoundingMode.HALF_UP)); else yard.setMean(BigDecimal.ZERO);
             */
        }

        // If minimum yard distance defined, then use the same. Here we are overwrite
        // the value which is calculated in
        // MinDistance.getYardMinDistance method.
        // List<BigDecimal> dimensions = Util.getListOfDimensionValueByLayer(doc, name);
        List<BigDecimal> distanceForMean = Util.getListOfDimensionOtherThanSpecifiedColourCode(doc, name,
                DxfFileConstants.YARD_DIMENSION_COLOR, pl);

        /*
         * if (!dimensions.isEmpty()) { yard.setDimensions(dimensions); yard.setMinimumDistance(
         * Collections.min(dimensions).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, RoundingMode.HALF_UP)); //
         * Collections.min(dimensions).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, RoundingMode.HALF_UP); }
         */
        if (!distanceForMean.isEmpty()) {
            BigDecimal min = Collections.min(distanceForMean).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                    RoundingMode.HALF_UP);
            yard.setMean(yard.getArea().divide(min, DcrConstants.DECIMALDIGITS_MEASUREMENTS, RoundingMode.HALF_UP));
        }

        List<Point> outsidePoints = Util.findPointsOnPolylines(yardOutSidePoints, yardLines, pl, name);

        List<Point> insidePoints = Util.findPointsOnPolylines(yardInSidePoints, yardLines, pl, name);

        if (yardInSidePoints.isEmpty() || yardInSidePoints.size() == 1)
            if (level.equals(-1))
                pl.getErrors().put("Set back calculation error for basementfootprint " + name, "Points of " + name
                        + " not properly on " + layerNames.getLayerName("LAYER_NAME_BSMNT_FOOT_PRINT"));
            else
                pl.getErrors().put("Set back calculation error for footprint" + name, "Points of " + name
                        + " not properly on " + layerNames.getLayerName("LAYER_NAME_BUILDING_FOOT_PRINT"));
        if (outsidePoints.isEmpty() || outsidePoints.size() == 1)
            pl.getErrors().put("Set back calculation error for boundary" + name,
                    "Points of " + name + " not properly on " + layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY"));

        double distance = 0;
        Map<Double, DXFLine> map = new HashMap<>();
        Set<Double> singleDistanceList = new TreeSet<>();
        List<Double> avgList = new ArrayList<>();
        for (Point in : insidePoints) {
            if (!singleDistanceList.isEmpty()) {
                Iterator<Double> iterator = singleDistanceList.iterator();
                if (iterator.hasNext()) {
                    avgList.add(iterator.next());
                    singleDistanceList = new TreeSet<>();
                }
            }
            int incr = 0;
            for (Point out : outsidePoints)
                if (insidePoints.size() < 10) {
                    distance = MathUtils.distance(in, out);
                    distanceList.add(distance);
                    singleDistanceList.add(distance);
                } else {
                    incr++;

                    if (incr % 10 == 1) {

                        distance = MathUtils.distance(in, out);
                        singleDistanceList.add(distance);
                        distanceList.add(distance);
                        // if this is lowest print else dont
                        Iterator<Double> iterator = distanceList.iterator();
                        if (iterator.hasNext() && distance == iterator.next()) {
                            LOG.debug("Distance******* : " + distance);
                            DXFLine line = new DXFLine();
                            line.setStartPoint(out);
                            line.setEndPoint(in);
                            map.put(distance, line);
                            LOG.debug("Outside : " + out.getX() + "," + out.getY() + " inside" + in.getX() + ","
                                    + in.getY());
                        }

                    }
                }

        }

        if (yard.getMean().doubleValue() == 0.0d) {
            Double avg = 0.0d;
            if (!avgList.isEmpty()) {
                for (Double d : avgList)
                    avg = avg + d;

                avg = avg / avgList.size();
                LOG.info("Average from min distance is................. " + avg);

                yard.setMean(BigDecimal.valueOf(avg).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                        RoundingMode.HALF_UP));

            } else
                yard.setMean(BigDecimal.ZERO);
        }

        if (yard.getMinimumDistance().doubleValue() > 0.0d)
            return yard.getMinimumDistance();

        if (!distanceList.isEmpty()) {
            Double dist = distanceList.iterator().next();
            DXFLine line = map.get(dist);
            LOG.debug("the shortest Distance is " + dist);
            PrintUtil.printForDXf(line.getStartPoint(), line.getEndPoint(), name + "_MIN_DISTANCE", pl);
            return BigDecimal.valueOf(dist).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, RoundingMode.HALF_UP);
        } else
            return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);

    }

    public static Double getSideForMean(List<Point> yardInSidePoints, List<Point> yardOutSidePoints, Yard yard1) {
        DXFLWPolyline yard = ((YardDetail) yard1).getPolyLine();
        Double distance = 0d;
        Point firstPoint = null;
        Point lastPoint = null;
        BigDecimal maxDistance = BigDecimal.ZERO;
        BigDecimal maxDistance2 = BigDecimal.ZERO;
        Point firstPoint2 = null;
        Point lastPoint2 = null;
        for (Point out : yardInSidePoints) {

            LOG.debug("Out =" + out.getX() + "  " + out.getY());
            for (Point in : yardInSidePoints) {

                if (out == in) {
                    PrintUtil.print(in, "First Point");
                    continue;
                }
                distance = MathUtils.distance(out, in);

                if (maxDistance.compareTo(BigDecimal.valueOf(0)) == 0
                        || maxDistance.compareTo(BigDecimal.valueOf(distance)) < 0) {
                    maxDistance = BigDecimal.valueOf(distance);
                    firstPoint = out;
                    lastPoint = in;
                }
            }
        }

        for (Point out : yardOutSidePoints) {

            LOG.debug("Out =" + out.getX() + "  " + out.getY());
            for (Point in : yardOutSidePoints) {

                if (out == in) {
                    PrintUtil.print(in, "Second first Point");
                    continue;
                }
                distance = MathUtils.distance(out, in);

                if (maxDistance2.compareTo(BigDecimal.valueOf(0)) == 0
                        || maxDistance2.compareTo(BigDecimal.valueOf(distance)) < 0) {
                    maxDistance2 = BigDecimal.valueOf(distance);
                    firstPoint2 = out;
                    lastPoint2 = in;
                }
            }
        }
        if (firstPoint != null) {
            LOG.debug(" firstPoint x   " + firstPoint.getX() + "  " + firstPoint.getY() + "  lastpoint  "
                    + lastPoint.getX() + "  " + lastPoint.getY());

            Double absXValue = Math.abs(firstPoint.getX() - lastPoint.getX());
            Double absYValue = Math.abs(firstPoint.getY() - lastPoint.getY());
            LOG.debug(" maxDistance = " + maxDistance);
            LOG.debug("");
            LOG.debug(" Max x - Min x = " + absXValue);
            LOG.debug(" Max y - Min y = " + absYValue);
            LOG.debug("");

            Double absXValue2 = 0d;
            Double absYValue2 = 0d;
            if (firstPoint2 != null) {
                absXValue2 = Math.abs(firstPoint2.getX() - lastPoint2.getX());
                absYValue2 = Math.abs(firstPoint2.getY() - lastPoint2.getY());
                LOG.debug(" maxDistance2 = " + maxDistance2);
                LOG.debug("");
                LOG.debug(" Max x2 - Min x2 = " + absXValue2);
                LOG.debug(" Max y2 - Min y2 = " + absYValue2);
                LOG.debug("");

            }

            Double width1 = Math.abs(yard.getBounds().getWidth() - absXValue);
            Double height1 = Math.abs(yard.getBounds().getHeight() - absXValue);

            Double width2 = Math.abs(yard.getBounds().getWidth() - absYValue);
            Double height2 = Math.abs(yard.getBounds().getHeight() - absYValue);
            LOG.debug("");
            LOG.debug("Width1 = " + width1);
            LOG.debug("Width2 = " + width2);
            LOG.debug("Height1 = " + height1);
            LOG.debug("Height2 = " + height2);
            LOG.debug("");
            Double sideDistance = 0d;
            double minWidth = Math.min(width1, width2);
            double minHeight = Math.min(height1, height2);

            if (minWidth < minHeight) {
                // sideDistance=(absXValue + absXValue2)/2;
                sideDistance = absXValue > absXValue2 ? absXValue : absXValue2;

                // sideDistance = yard.getBounds().getWidth();
                LOG.debug("Distance for Mean Calculation is Width = " + sideDistance);
            } else {
                // sideDistance=(absYValue + absYValue2)/2;
                sideDistance = absYValue > absYValue2 ? absYValue : absYValue2;

                // sideDistance = yard.getBounds().getHeight();
                LOG.debug("Distance for Mean Calculation is Height = " + sideDistance);
            }
            /*
             * if(maxDistance.doubleValue() < maxDistance2.doubleValue()) maxDistance=maxDistance2;
             */

            LOG.debug(" Area = " + yard1.getArea());
            if (sideDistance > 0d && yard1.getArea() != null)
                // yard1.setMean(yard1.getArea().divide(maxDistance, 2, RoundingMode.HALF_UP));
                yard1.setMean(yard1.getArea().divide(BigDecimal.valueOf(sideDistance), 2, RoundingMode.HALF_UP));
            else
                yard1.setMean(BigDecimal.ZERO);
            LOG.debug("Mean   = " + yard1.getMean());
        }
        return null;
    }

    private static void removeDuplicates(List<Point> fromList, List<Point> containingList) {
        List<Point> toRemove = new ArrayList<>();
        for (Point p : fromList)
            for (Point p1 : containingList)
                if (Util.pointsEquals(p1, p)) {
                    PrintUtil.print(p, "Marked for Removal from outside");
                    toRemove.add(p);
                }

        for (Point p : toRemove)
            fromList.remove(p);
    }

    private static List<DXFLine> getLinesOfPolyline(DXFLWPolyline yard) {
        List<DXFLine> lines = new ArrayList<>();
        Iterator vertexIterator = yard.getVertexIterator();
        DXFVertex next = null;
        DXFVertex first = null;

        while (vertexIterator.hasNext()) {
            DXFVertex point1 = (DXFVertex) vertexIterator.next();
            if (next != null) {
                DXFLine line = new DXFLine();
                line.setStartPoint(next.getPoint());
                line.setEndPoint(point1.getPoint());
                lines.add(line);
            } else
                first = point1;
            next = point1;

        }
        if (next != null && first != null && !Util.pointsEquals(first.getPoint(), next.getPoint())) {
            // if (next!=null && first!=null) {
            DXFLine line = new DXFLine();
            line.setStartPoint(next.getPoint());
            line.setEndPoint(first.getPoint());
            lines.add(line);
        }
        PrintUtil.printLine(lines, yard.getLayerName());

        return lines;
    }

}