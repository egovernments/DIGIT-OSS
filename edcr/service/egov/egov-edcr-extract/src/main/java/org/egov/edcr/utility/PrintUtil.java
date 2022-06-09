package org.egov.edcr.utility;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLine;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;

public class PrintUtil {
    private static final Logger LOG = LogManager.getLogger(PrintUtil.class);
    public static final String POINT_PRECISION = "ALL";

    public static void print(Map<String, String> map) {
        if (LOG.isDebugEnabled())
            LOG.debug(map.getClass().getName());
        Iterator<Entry<String, String>> iterator = map.entrySet().iterator();
        while (iterator.hasNext()) {
            Entry<String, String> next = iterator.next();
            LOG.debug(next.getKey() + "---" + next.getValue());
        }
    }

    public static void printS(List<ScrutinyDetail> sd) {

        for (ScrutinyDetail ssd : sd) {
            LOG.info(ssd.getKey() + "--" + ssd.getHeading() + "--" + ssd.getColumnHeading());

            for (Map m : ssd.getDetail())
                for (Object s : m.keySet())
                    LOG.info(m.get(s));
        }
    }

    public static void markCircle(Set<MeasurementDetail> duplicates, PlanDetail pl, String layerName, String color) {
        Set<Point> midPoints = new HashSet<>();
        LOG.debug("Printing Circle for dxf");
        for (MeasurementDetail m : duplicates) {
            DXFLWPolyline polyLine = m.getPolyLine();
            Point p = getCentre(polyLine);
            boolean add = isDuplicate(p, midPoints);
            if (!add) {
                midPoints.add(p);
                StringBuilder sb = new StringBuilder();
                LOG.error("adding for point " + p.getX() + "," + p.getY());
                sb.append("\n");
                sb.append("0").append("\n");
                sb.append("ARC").append("\n");
                sb.append("5").append("\n");
                sb.append("47").append("\n");
                sb.append("100").append("\n");
                sb.append("AcDbEntity").append("\n");
                sb.append("8").append("\n");
                sb.append(layerName).append("\n");
                sb.append("6").append("\n");
                sb.append("ByLayer").append("\n");
                sb.append("62").append("\n");
                sb.append(color).append("\n");
                sb.append("370").append("\n");
                sb.append("-1").append("\n");
                sb.append("100").append("\n");
                sb.append("AcDbCircle").append("\n");
                sb.append("10").append("\n");
                sb.append(p.getX()).append("\n");
                sb.append("20").append("\n");
                sb.append(p.getY()).append("\n");
                sb.append("40").append("\n");
                sb.append(polyLine.getBounds().getMaximumX() - polyLine.getBounds().getMinimumX());
                // .append("\n");
                LOG.debug("##############\n" + sb.toString());
                pl.addToAdditionsToDxf(sb.toString());
            }
        }

    }

    public static void print(List<Floor> floors) {
        /*
         * if (LOG.isDebugEnabled()) { for (Floor floor : floors) { LOG.debug("Floor Name" + floor.getName()); if
         * (floor.getExterior() != null) { LOG.debug("Ext points Count" + floor.getExterior().getPolyLine().getVertexCount());
         * LOG.debug("maxx  : " + floor.getExterior().getPolyLine().getBounds().getMaximumX() + " minx :  " +
         * floor.getExterior().getPolyLine().getBounds().getMinimumX()); LOG.debug("maxy  : " +
         * floor.getExterior().getPolyLine().getBounds().getMaximumY() + " minx :  " +
         * floor.getExterior().getPolyLine().getBounds().getMinimumY()); print(floor.getExterior().getPolyLine(),
         * floor.getName()); } LOG.debug("Habitable Rooms count" + floor.getHabitableRooms().size()); int i = 0; for (Room r :
         * floor.getHabitableRooms()) { LOG.debug("maxx  : " + r.getPolyLine().getBounds().getMaximumX() + " minx :  " +
         * r.getPolyLine().getBounds().getMinimumX()); LOG.debug("maxy  : " + r.getPolyLine().getBounds().getMaximumY() +
         * " minx :  " + r.getPolyLine().getBounds().getMinimumY()); print(r.getPolyLine(), floor.getName() + "_Room_" + i++); } }
         * }
         */
    }

    public static void print(PlanDetail pl, String s) {
        if (LOG.isDebugEnabled()) {
            LOG.debug("Set Backs");
            LOG.debug("Front Yard \n " + pl.getPlot().getFrontYard());
            LOG.debug("Side Yard1 \n " + pl.getPlot().getSideYard1());
            LOG.debug("Side Yard2 \n " + pl.getPlot().getSideYard2());
            LOG.debug("Rear Yard \n " + pl.getPlot().getRearYard());
            LOG.debug(pl.getElectricLine());
            // LOG.debug(pl.getBuilding());
        }
    }

    public static void print(PlanDetail pl) {
        if (LOG.isDebugEnabled()) {
            LOG.debug("Set Backs");
            LOG.debug("Front Yard \n " + pl.getPlot().getFrontYard());
            LOG.debug("Side Yard1 \n " + pl.getPlot().getSideYard1());
            LOG.debug("Side Yard2 \n " + pl.getPlot().getSideYard2());
            LOG.debug("Rear Yard \n " + pl.getPlot().getRearYard());
            LOG.debug(pl.getElectricLine());
            // LOG.debug(pl.getBuilding());
            // print(pl.getReportOutput());
            print(pl.getErrors());
        }
    }

    public static void print(Point plotBoundaryEdge, String name) {
        if (POINT_PRECISION.equals("ALL"))
            LOG.debug(name + " " + plotBoundaryEdge.getX() + " , " + plotBoundaryEdge.getY());
        else
            LOG.debug(name + " " + BigDecimal.valueOf(plotBoundaryEdge.getX()).setScale(5) + " , "
                    + BigDecimal.valueOf(plotBoundaryEdge.getY()).setScale(5));

    }

    public static void print(List<Point> lines, String name) {
        LOG.debug(name + "Points  are as follows");
        for (Point line : lines)
            print(line, "");
        LOG.debug("End of Points");

    }

    public static void printForDXf(Point p1, Point p2, String layerName, PlanDetail pl) {
        StringBuilder sb = new StringBuilder();
        sb.append("LINE").append("\n");
        sb.append("5").append("\n");
        sb.append("49").append("\n");
        sb.append("100").append("\n");
        sb.append("AcDbEntity").append("\n");
        sb.append("8").append("\n");
        sb.append(layerName).append("\n");
        sb.append("6").append("\n");
        sb.append("ByLayer").append("\n");
        sb.append("62").append("\n");
        sb.append("256").append("\n");
        sb.append("370").append("\n");
        sb.append("-1").append("\n");
        sb.append("100").append("\n");
        sb.append("AcDbLine").append("\n");
        sb.append("10").append("\n").append(p1.getX()).append("\n");
        sb.append("20").append("\n").append(p1.getY()).append("\n");
        sb.append("11").append("\n").append(p2.getX()).append("\n");
        sb.append("21").append("\n").append(p2.getY()).append("\n");
        sb.append("0").append("\n");
        LOG.debug("***************\n" + sb.toString());
        pl.addToAdditionsToDxf(sb.toString());

    }

    public static void printForDXfPoint(List<Point> outsidePoints, String layerName, PlanDetail pl) {
        LOG.error("Printing lines for dxf");
        StringBuilder sb = new StringBuilder();
        // sb.append("Printing lines for dxf");
        sb.append("LWPOLYLINE").append("\n");
        ;
        sb.append("5").append("\n");
        sb.append("47").append("\n");
        sb.append("100").append("\n");
        sb.append("AcDbEntity").append("\n");
        sb.append("8").append("\n");
        sb.append(layerName).append("\n");
        sb.append("6").append("\n");
        sb.append("ByLayer").append("\n");
        sb.append("62").append("\n");
        sb.append("256").append("\n");
        sb.append("370").append("\n");
        sb.append("-1").append("\n");
        sb.append("100").append("\n");
        sb.append("AcDbPolyline").append("\n");
        sb.append("90").append("\n");
        sb.append("5").append("\n");
        sb.append("70").append("\n");
        sb.append("0").append("\n");
        sb.append("43").append("\n");
        sb.append("0").append("\n");

        for (Point p : outsidePoints) {
            sb.append("10").append("\n");
            sb.append(p.getX()).append("\n");

            sb.append("20").append("\n");
            sb.append(p.getY()).append("\n");
        }
        sb.append("0").append("\n");
        pl.addToAdditionsToDxf(sb.toString());
        LOG.debug("##############\n" + sb.toString());
    }

    public static void print(DXFLWPolyline yard, String name) {
        if (LOG.isDebugEnabled())
            if (yard != null) {
                Iterator vertexIterator = yard.getVertexIterator();
                LOG.debug("Points on the " + name);
                LOG.debug("Max x: " + yard.getBounds().getMaximumX() + " Min x:" + yard.getBounds().getMinimumX());
                LOG.debug("Max y: " + yard.getBounds().getMaximumY() + " Min x:" + yard.getBounds().getMinimumY());
                while (vertexIterator.hasNext()) {
                    DXFVertex next = (DXFVertex) vertexIterator.next();
                    LOG.debug(next.getPoint().getX() + "," + next.getPoint().getY());
                }
            }
    }

    public static void printLine(List<DXFLine> lines, String name) {
        LOG.debug("The " + name + " lines are as follows");
        for (DXFLine line : lines) {
            print(line.getStartPoint(), "Start ");
            print(line.getEndPoint(), "End ");
        }
        LOG.debug("End of line");

    }
    
    private static boolean isDuplicate(Point newPoint, Set<Point> midPoints) {
        boolean duplicate = false;
        for (Point existingPoint : midPoints) {
            if (Util.pointsEquals(existingPoint, newPoint)) {
                duplicate = true;
                break;
            }
        }
        return duplicate;
    }

    private static Point getCentre(DXFLWPolyline polyLine) {
        Point p = new Point();
        p.setX((polyLine.getBounds().getMaximumX() - polyLine.getBounds().getMinimumX()) / 2
                + polyLine.getBounds().getMinimumX());
        p.setY((polyLine.getBounds().getMaximumY() - polyLine.getBounds().getMinimumY()) / 2
                + polyLine.getBounds().getMinimumY());
        return p;
    }

}
