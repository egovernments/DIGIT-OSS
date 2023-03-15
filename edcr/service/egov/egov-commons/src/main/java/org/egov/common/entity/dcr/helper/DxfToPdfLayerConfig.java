/**
 * 
 */
package org.egov.common.entity.dcr.helper;

import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.printing.Orientation;

/**
 * @author vinoth
 *
 */
public class DxfToPdfLayerConfig {

    // Plan pdf name
    private String sheetName;

    // Page size of pdf like A0, A1, A2, A3, A4
    private String sheetSize = "A3";

    // Pdf page size enlarging on top of default size like A0*3, A1*2
    private int sheetSizeEnlargeFactor = 1;

    // Pdf page orientation
    private Orientation orientation = Orientation.PORTRAIT;

    private boolean removeHatch = false;

    private List<PlanPdfLayerConfig> planPdfLayerConfigs = new ArrayList<>();

    public String getSheetName() {
        return sheetName;
    }

    public void setSheetName(String sheetName) {
        this.sheetName = sheetName;
    }

    public String getSheetSize() {
        return sheetSize;
    }

    public void setSheetSize(String sheetSize) {
        this.sheetSize = sheetSize;
    }

    public int getSheetSizeEnlargeFactor() {
        return sheetSizeEnlargeFactor;
    }

    public void setSheetSizeEnlargeFactor(int sheetSizeEnlargeFactor) {
        this.sheetSizeEnlargeFactor = sheetSizeEnlargeFactor;
    }

    public Orientation getOrientation() {
        return orientation;
    }

    public void setOrientation(Orientation orientation) {
        this.orientation = orientation;
    }

    public boolean isRemoveHatch() {
        return removeHatch;
    }

    public void setRemoveHatch(boolean removeHatch) {
        this.removeHatch = removeHatch;
    }

    public List<PlanPdfLayerConfig> getPlanPdfLayerConfigs() {
        return planPdfLayerConfigs;
    }

    public void setPlanPdfLayerConfigs(List<PlanPdfLayerConfig> planPdfLayerConfigs) {
        this.planPdfLayerConfigs = planPdfLayerConfigs;
    }

}
