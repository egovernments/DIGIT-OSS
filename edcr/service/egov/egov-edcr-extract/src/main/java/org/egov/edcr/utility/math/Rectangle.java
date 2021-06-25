package org.egov.edcr.utility.math;

public class Rectangle {

    double x = Double.MAX_VALUE;
    double y = Double.MAX_VALUE;
    double d = Double.MIN_VALUE;
    double e = Double.MIN_VALUE;

    public Rectangle(double minX2, double minY2, double d, double e) {
        x = minX2;
        y = minY2;
        this.d = d;
        this.e = e;

    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getD() {
        return d;
    }

    public void setD(double d) {
        this.d = d;
    }

    public double getE() {
        return e;
    }

    public void setE(double e) {
        this.e = e;
    }

}
