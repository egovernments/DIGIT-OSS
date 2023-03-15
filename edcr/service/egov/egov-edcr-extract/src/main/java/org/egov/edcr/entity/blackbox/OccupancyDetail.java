package org.egov.edcr.entity.blackbox;

import org.egov.common.entity.edcr.Occupancy;
import org.kabeja.dxf.DXFLWPolyline;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OccupancyDetail extends Occupancy {
    /**
     *
     */
    private static final long serialVersionUID = 75L;
    @JsonIgnore
    protected transient DXFLWPolyline polyLine;

    public DXFLWPolyline getPolyLine() {
        return polyLine;
    }

    public void setPolyLine(DXFLWPolyline polyLine) {
        this.polyLine = polyLine;
    }
}
