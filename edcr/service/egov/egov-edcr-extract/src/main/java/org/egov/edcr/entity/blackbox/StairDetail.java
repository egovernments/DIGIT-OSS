package org.egov.edcr.entity.blackbox;

import java.util.List;

import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Stair;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLine;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StairDetail extends Stair {

    /**
     *
     */
    private static final long serialVersionUID = 77L;
    @JsonIgnore
    private transient List<DXFLWPolyline> stairPolylines;
    @JsonIgnore
    private transient List<Measurement> flightPolyLines;
    @JsonIgnore
    private transient List<DXFLine> lines;

    public List<DXFLWPolyline> getStairPolylines() {
        return stairPolylines;
    }

    public void setStairPolylines(List<DXFLWPolyline> stairPolylines) {
        this.stairPolylines = stairPolylines;
    }

    public List<Measurement> getFlightPolyLines() {
        return flightPolyLines;
    }

    public void setFlightPolyLines(List<Measurement> flightPolyLines) {
        this.flightPolyLines = flightPolyLines;
    }

    public List<DXFLine> getLines() {
        return lines;
    }

    public void setLines(List<DXFLine> lines) {
        this.lines = lines;
    }

}
