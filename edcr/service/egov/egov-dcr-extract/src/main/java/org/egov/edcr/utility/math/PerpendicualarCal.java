package org.egov.edcr.utility.math;

public class PerpendicualarCal {

    public static void main(String args[]) {
        getPerpendicularDistance();
    }

    private static void getPerpendicularDistance() {

        double x1 = 4;
        double y1 = 3;

        double x2 = 5;
        double y2 = 3;

        double x3 = 2;
        double y3 = 2;

        // first convert line to normalized unit vector
        double dx = x2 - x1;
        double dy = y2 - y1;
        double mag = Math.sqrt(dx * dx + dy * dy);
        dx /= mag;
        dy /= mag;

        // translate the point and get the dot product
        double lambda = dx * (x3 - x1) + dy * (y3 - y1);
        double x4 = dx * lambda + x1;
        double y4 = dy * lambda + y1;
        System.out.println(x4 + "," + y4);

    }

}
