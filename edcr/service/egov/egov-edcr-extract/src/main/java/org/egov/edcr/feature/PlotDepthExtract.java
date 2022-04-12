
package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
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
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.entity.blackbox.PlotDetail;
import org.egov.edcr.entity.blackbox.YardDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.PrintUtil;
import org.egov.edcr.utility.Util;
import org.egov.edcr.utility.math.Ray;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLine;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.kabeja.math.MathUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlotDepthExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(PlotDepthExtract.class);
    final Ray rayCasting = new Ray(new Point(-1.123456789, -1.987654321, 0d));
    @Autowired
    private static LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        for (Block blk : pl.getBlocks())
            getPlotDepth(pl, blk, pl.getDoc());
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    public BigDecimal getPlotDepth(PlanDetail pl, Block blk, DXFDocument doc) {
        DXFLWPolyline plotBoundary = ((PlotDetail) pl.getPlot()).getPolyLine();

        SetBack setBackByLevel = blk.getSetBackByLevel("0");

        List<Point> frontYardPoints = new ArrayList<>();
        List<Point> rearYardPoints = new ArrayList<>();
        String name = "Block " + blk.getNumber();

        if (setBackByLevel.getFrontYard() != null)
            frontYardPoints = getPoints(pl, name, plotBoundary, setBackByLevel.getFrontYard());

        if (setBackByLevel.getRearYard() != null)
            rearYardPoints = getPoints(pl, name, plotBoundary, setBackByLevel.getRearYard());

        removeDuplicates(frontYardPoints, rearYardPoints);
        Set<Double> distanceList = new TreeSet<>();
        BigDecimal distances = getDistances(pl, distanceList, frontYardPoints, rearYardPoints);
        return distances;

    }

    private static List<Point> getPoints(PlanDetail pl, String name, DXFLWPolyline plotBoundary, Yard yard) {
        DXFLWPolyline yardPolyline;

        yardPolyline = ((YardDetail) yard).getPolyLine();

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

        if (!yardPolyline.isClosed())
            pl.getErrors().put(name + " not closed", name + " is not closed ");

        Iterator yardVertexIterator = yardPolyline.getVertexIterator();
        PrintUtil.print(yardPolyline, name);
        List<Point> yardPointTouchingPltBndry = new ArrayList<>();
        new TreeSet<>();
        // Find the edges of PlotBoundary
        List<Point> plotBoundaryEdges = Util.pointsOnPolygon(plotBoundary);
        // Find the points connecting the edges of PlotBoundary
        List<Point> pointsOnPlot = Util.findPointsOnPolylines(plotBoundaryEdges);

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
                    yardPointTouchingPltBndry.add(yardEdge);
                    LOG.debug("Adding yardEdge to outside points in direct compare");
                    break outside;
                }

                if (Util.pointsEqualsWith2PercentError(plotBoundaryEdge, yardEdge)) {
                    pointAdded = true;
                    yardPointTouchingPltBndry.add(yardEdge);
                    LOG.debug("Adding yardEdge to outside points in  pointsEqualsWith2PercentError compare");
                    break outside;
                }
            }

            if (!pointAdded && pointsOnPlot.contains(yardEdge)) {
                yardPointTouchingPltBndry.add(yardEdge);
                LOG.debug("Adding yardEdge to outside points in  Contains compare");
                pointAdded = true;
            }

            if (!pointAdded)
                for (Point p : pointsOnPlot)
                    if (Util.pointsEquals(p, yardEdge)) {
                        yardPointTouchingPltBndry.add(yardEdge);
                        LOG.debug("Adding yardEdge to outside points in  pointsOnPlot pointsEquals");
                        pointAdded = true;
                        break;
                    }

            if (!pointAdded)
                for (Point p : pointsOnPlot)
                    if (Util.pointsEqualsWith2PercentError(p, yardEdge)) {
                        yardPointTouchingPltBndry.add(yardEdge);
                        LOG.debug("Adding yardEdge to outside points in  pointsOnPlot pointsEqualsWith2PercentError");
                        pointAdded = true;
                        break;
                    }

        }

        PrintUtil.print(yardPointTouchingPltBndry, "yardPointTouchingPltBndry");

        List<Point> outsidePoints = Util.findPointsOnPolylines(yardPointTouchingPltBndry, yardLines, pl,
                name + "_DEPTH");

        if (outsidePoints.isEmpty() || outsidePoints.size() == 1)
            pl.getErrors().put("Set back calculation error for boundary" + name,
                    "Points of " + name + " not properly on " + layerNames.getLayerName("LAYER_NAME_PLOT_BOUNDARY"));

        return outsidePoints;

    }

    private BigDecimal getDistances(PlanDetail pl, Set<Double> distanceList, List<Point> outsidePoints,
            List<Point> insidePoints) {
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

        if (!distanceList.isEmpty()) {
            Double dist = distanceList.iterator().next();
            DXFLine line = map.get(dist);
            LOG.info("the shortest Distance is " + dist);
            PrintUtil.printForDXf(line.getStartPoint(), line.getEndPoint(), "PLOT_DEPTH", pl);
            // return
            // BigDecimal.valueOf(dist).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
            // RoundingMode.HALF_UP);
        } /*
           * else return BigDecimal.ZERO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS);
           */

        Double total = 0d;
        for (Map.Entry<Double, DXFLine> mapLine : map.entrySet())
            total = total + mapLine.getKey();

        Double avg = 0d;

        avg = total / map.size();

        LOG.info("average == " + avg);

        if (pl.getPlot() != null) {
            BigDecimal divide = pl.getPlot().getArea().divide(BigDecimal.valueOf(avg),
                    DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);
            LOG.info("plot area remainder = " + divide);
        }

        return BigDecimal.valueOf(avg);
        /*
         * if (yard.getMean().doubleValue() == 0.0d) { Double avg = 0.0d; if (!avgList.isEmpty()) { for (Double d : avgList) { avg
         * = avg + d; } avg = avg / avgList.size(); LOG.info("Average from min distance is................. " + avg);
         * yard.setMean(BigDecimal.valueOf(avg).setScale(DcrConstants. DECIMALDIGITS_MEASUREMENTS, RoundingMode.HALF_UP)); } else
         * { yard.setMean(BigDecimal.ZERO); } } if (yard.getMinimumDistance().doubleValue() > 0.0d) { return
         * yard.getMinimumDistance(); }
         */

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
