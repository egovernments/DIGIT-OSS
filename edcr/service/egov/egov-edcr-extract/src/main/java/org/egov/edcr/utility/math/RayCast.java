package org.egov.edcr.utility.math;

import static java.lang.Math.max;
import static java.lang.Math.min;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.apache.log4j.Logger;

public class RayCast {
	
	private static final Logger LOG = Logger.getLogger(RayCast.class);
    private static final int DECIMALDIGITS = 8;

    static int i = 0;

    public static boolean intersects(double[] A, double[] B, double[] P) {
        /*
         * LOG.info("\n checking for point"+P[0]+","+P[1]); LOG.info("A:"+A[0]+","+A[1]);
         * LOG.info("B:"+B[0]+","+B[1]);
         */

        if (A[1] > B[1])
            return intersects(B, A, P);

        if (P[1] == A[1] || P[1] == B[1])
            P[1] += 0.000000001;

        if (P[1] > B[1] || P[1] < A[1] || P[0] >= max(A[0], B[0]))
            // LOG.info("return false");
            return false;

        if (P[0] <= min(A[0], B[0]))
            // LOG.info("return true");
            return true;

        double red = (P[1] - A[1]) / (P[0] - A[0]);
        double blue = (B[1] - A[1]) / (B[0] - A[0]);
        // LOG.info("red"+red+",blue"+blue);
        BigDecimal redB = BigDecimal.valueOf(blue).setScale(DECIMALDIGITS, RoundingMode.DOWN);
        BigDecimal redR = BigDecimal.valueOf(red).setScale(8, RoundingMode.DOWN);
        // LOG.info("red"+redR+",blue"+redB);
        // LOG.info("Compare"+redR.compareTo(redB));
        return redR.compareTo(redB) >= 0;

    }

    public static boolean intersectsForSide(double[] A, double[] B, double[] P) {
        // LOG.info("P:"+P[0]+",A:"+A[0]+",B:"+B[0]);
        // LOG.info(P[1]+","+A[1]+","+B[1]);
        if (A[1] > B[1])
            return intersects(B, A, P);

        if (P[1] == A[1] || P[1] == B[1])
            P[1] += 0.00001;

        if (P[1] > B[1] || P[1] < A[1] || P[0] >= max(A[0], B[0]))
            return false;

        if (P[1] >= min(A[1], B[1]))
            return true;

        i++;
        double red = (P[1] - A[1]) / (P[0] - A[0]);
        BigDecimal redb = BigDecimal.valueOf(red);
        LOG.info("red--" + i + "--" + red);
        double blue = (B[1] - A[1]) / (B[0] - A[0]);
        BigDecimal blueb = BigDecimal.valueOf(blue);
        LOG.info("blue--" + blue);
        LOG.info(redb.compareTo(blueb) >= 0);
        // return redb.compareTo(blueb) >=0 ;
        return red >= blue;

    }

    public static boolean contains(double[][] shape, double[] pnt) {
        boolean inside = false;
        int len = shape.length;
        for (int i = 0; i < len; i++)
            // LOG.info("contains "+shape[i][0]+","+shape[i][1]+" and "+shape[(i + 1) % len][0]+","+shape[(i + 1) %
            // len][1]);
            if (intersects(shape[i], shape[(i + 1) % len], pnt))
                // LOG.info("---------------------got true ");
                inside = true;
        return inside;
    }

    public static boolean containsSide(double[][] shape, double[] pnt) {
        boolean inside = false;
        int len = shape.length;
        for (int i = 0; i < len; i++)
            if (intersectsForSide(shape[i], shape[(i + 1) % len], pnt))
                inside = !inside;
        return inside;
    }

    public static void main(String[] a) {

        /*
         * for (int[][] shape : shapes) { for (double[] pnt : testPoints) LOG.info("%7s ", contains(shape, pnt));
         * LOG.info(); }
         */
    }

    static final int[][] square = { { 0, 0 }, { 20, 0 }, { 20, 20 }, { 0, 20 } };

    static final int[][] squareHole = { { 0, 0 }, { 20, 0 }, { 20, 20 }, { 0, 20 },
            { 5, 5 }, { 15, 5 }, { 15, 15 }, { 5, 15 } };

    static final int[][] strange = { { 0, 0 }, { 5, 5 }, { 0, 20 }, { 5, 15 }, { 15, 15 },
            { 20, 20 }, { 20, 0 } };

    static final int[][] hexagon = { { 6, 0 }, { 14, 0 }, { 20, 10 }, { 14, 20 },
            { 6, 20 }, { 0, 10 } };

    static final int[][][] shapes = { square, squareHole, strange, hexagon };
}
