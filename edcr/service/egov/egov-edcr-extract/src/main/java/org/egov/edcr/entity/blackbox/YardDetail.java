package org.egov.edcr.entity.blackbox;

import org.egov.common.entity.edcr.Yard;
import org.kabeja.dxf.DXFLWPolyline;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YardDetail extends Yard {
    /**
     *
     */
    private static final long serialVersionUID = 78L;
    @JsonIgnore
    protected transient DXFLWPolyline polyLine;

    public DXFLWPolyline getPolyLine() {
        return polyLine;
    }

    public void setPolyLine(DXFLWPolyline polyLine) {
        this.polyLine = polyLine;
    }

}
