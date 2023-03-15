package org.egov.edcr.entity.blackbox;

import java.math.BigDecimal;

import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MeasurementDetail extends Measurement {
    /**
     *
     */
    private static final long serialVersionUID = 74L;
    @JsonIgnore
    protected transient DXFLWPolyline polyLine;

    public DXFLWPolyline getPolyLine() {
        return polyLine;
    }

    public void setPolyLine(DXFLWPolyline polyLine) {
        this.polyLine = polyLine;
    }

    public MeasurementDetail() {
        //
    }

    public MeasurementDetail(DXFLWPolyline polyLine, Boolean smallSide) {
        this.polyLine = polyLine;
        area = Util.getPolyLineArea(polyLine);
        if (smallSide) {
            Util.setDimension(this, polyLine);
            colorCode = polyLine.getColor();
            length = BigDecimal.valueOf(polyLine.getLength());
            // this.minimumSide = Util.getSmallestSide(polyLine); added in setDimension
        }
    }

    public MeasurementDetail(DXFLWPolyline polyLine) {
        this.polyLine = polyLine;
        area = Util.getPolyLineArea(polyLine);
    }
}
