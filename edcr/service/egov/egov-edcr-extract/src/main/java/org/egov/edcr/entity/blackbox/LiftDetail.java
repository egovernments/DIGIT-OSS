package org.egov.edcr.entity.blackbox;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.entity.edcr.Lift;
import org.kabeja.dxf.DXFLWPolyline;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LiftDetail extends Lift {
    /**
     *
     */
    private static final long serialVersionUID = 72L;
    @JsonIgnore
    private transient List<DXFLWPolyline> polylines = new ArrayList<>();

    public List<DXFLWPolyline> getPolylines() {
        return polylines;
    }

    public void setPolylines(List<DXFLWPolyline> polylines) {
        this.polylines = polylines;
    }

}
