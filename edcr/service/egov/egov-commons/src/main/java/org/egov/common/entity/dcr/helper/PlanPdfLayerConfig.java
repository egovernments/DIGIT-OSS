/**
 * 
 */
package org.egov.common.entity.dcr.helper;

/**
 * @author vinoth
 *
 */
public class PlanPdfLayerConfig {
    // Plan layer name like
    private String layerName;
    // Dimension(D), Measurement(M)
    private String layerType;
    // Color code c1, c2
    private int overrideColor;
    // Line/text thickness
    private int overrideThickness;
    // Print layername
    private boolean printLayerName = false;

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getLayerType() {
        return layerType;
    }

    public void setLayerType(String layerType) {
        this.layerType = layerType;
    }

    public int getOverrideColor() {
        return overrideColor;
    }

    public void setOverrideColor(int overrideColor) {
        this.overrideColor = overrideColor;
    }

    public int getOverrideThickness() {
        return overrideThickness;
    }

    public void setOverrideThickness(int overrideThickness) {
        this.overrideThickness = overrideThickness;
    }

    public boolean isPrintLayerName() {
        return printLayerName;
    }

    public void setPrintLayerName(boolean printLayerName) {
        this.printLayerName = printLayerName;
    }

}
