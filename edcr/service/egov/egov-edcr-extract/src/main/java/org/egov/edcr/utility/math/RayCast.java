package org.egov.edcr.utility.math;

import static java.lang.Math.max;
import static java.lang.Math.min;

import java.math.BigDecimal;

public class RayCast {

    private static final int DECIMALDIGITS = 8;

    static int i = 0;

    public static boolean intersects(double[] A, double[] B, double[] P) {
        /*
         * System.out.println("\n checking for point"+P[0]+","+P[1]); System.out.println("A:"+A[0]+","+A[1]);
         * System.out.println("B:"+B[0]+","+B[1]);
         */

        if (A[1] > B[1])
            return intersects(B, A, P);

        if (P[1] == A[1] || P[1] == B[1])
            P[1] += 0.000000001;

        if (P[1] > B[1] || P[1] < A[1] || P[0] >= max(A[0], B[0]))
            // System.out.println("return false");
            return false;

        if (P[0] <= min(A[0], B[0]))
            // System.out.println("return true");
            return true;

        double red = (P[1] - A[1]) / (P[0] - A[0]);
        double blue = (B[1] - A[1]) / (B[0] - A[0]);
        // System.out.println("red"+red+",blue"+blue);
        BigDecimal redB = BigDecimal.valueOf(blue).setScale(DECIMALDIGITS, BigDecimal.ROUND_DOWN);
        BigDecimal redR = BigDecimal.valueOf(red).setScale(8, BigDecimal.ROUND_DOWN);
        // System.out.println("red"+redR+",blue"+redB);
        // System.out.println("Compare"+redR.compareTo(redB));
        return redR.compareTo(redB) >= 0;

    }

    public static boolean intersectsForSide(double[] A, double[] B, double[] P) {
        // System.out.println("P:"+P[0]+",A:"+A[0]+",B:"+B[0]);
        // System.out.println(P[1]+","+A[1]+","+B[1]);
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
        System.out.println("red--" + i + "--" + red);
        double blue = (B[1] - A[1]) / (B[0] - A[0]);
        BigDecimal blueb = BigDecimal.valueOf(blue);
        System.out.println("blue--" + blue);
        System.out.println(redb.compareTo(blueb) >= 0);
        // return redb.compareTo(blueb) >=0 ;
        return red >= blue;

    }

    public static boolean contains(double[][] shape, double[] pnt) {
        boolean inside = false;
        int len = shape.length;
        for (int i = 0; i < len; i++)
            // System.out.println("contains "+shape[i][0]+","+shape[i][1]+" and "+shape[(i + 1) % len][0]+","+shape[(i + 1) %
            // len][1]);
            if (intersects(shape[i], shape[(i + 1) % len], pnt))
                // System.out.println("---------------------got true ");
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
         * for (int[][] shape : shapes) { for (double[] pnt : testPoints) System.out.printf("%7s ", contains(shape, pnt));
         * System.out.println(); }
         */
    }

    final static int[][] square = { { 0, 0 }, { 20, 0 }, { 20, 20 }, { 0, 20 } };

    final static int[][] squareHole = { { 0, 0 }, { 20, 0 }, { 20, 20 }, { 0, 20 },
            { 5, 5 }, { 15, 5 }, { 15, 15 }, { 5, 15 } };

    final static int[][] strange = { { 0, 0 }, { 5, 5 }, { 0, 20 }, { 5, 15 }, { 15, 15 },
            { 20, 20 }, { 20, 0 } };

    final static int[][] hexagon = { { 6, 0 }, { 14, 0 }, { 20, 10 }, { 14, 20 },
            { 6, 20 }, { 0, 10 } };

    final static int[][][] shapes = { square, squareHole, strange, hexagon };
}
