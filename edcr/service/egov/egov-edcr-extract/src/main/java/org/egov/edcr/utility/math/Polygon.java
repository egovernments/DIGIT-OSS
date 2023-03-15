package org.egov.edcr.utility.math;

import java.util.Arrays;
import java.util.List;

import org.kabeja.dxf.helpers.Point;

/**
 * A polygon that is aware of it's min/max x/y coords
 */
public class Polygon {

    public final List<Point> points;

    // outer rectangular bounds of polygon
    public final Rectangle bounds;

    public Polygon(final Point... points) {
        this.points = Arrays.asList(points);
        bounds = calculateMinMaxBounds(this.points);
    }

    public Polygon(final List<Point> points) {
        this.points = points;
        bounds = calculateMinMaxBounds(this.points);
    }

    // used for our optimization mentioned above.
    private static Rectangle calculateMinMaxBounds(final List<Point> points) {
        double minX = Double.MAX_VALUE;
        double minY = Double.MAX_VALUE;
        double maxX = Double.MIN_VALUE;
        double maxY = Double.MIN_VALUE;

        for (final Point point : points) {
            if (point.getX() < minX)
                minX = point.getX();
            if (point.getY() < minY)
                minY = point.getY();
            if (point.getX() > maxX)
                maxX = point.getX();
            if (point.getY() > maxY)
                maxY = point.getY();
        }

        return new Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

}
