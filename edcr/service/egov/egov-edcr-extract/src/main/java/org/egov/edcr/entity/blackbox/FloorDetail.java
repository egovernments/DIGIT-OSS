package org.egov.edcr.entity.blackbox;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.entity.edcr.Floor;
import org.kabeja.dxf.DXFLWPolyline;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FloorDetail extends Floor {
    /**
     *
     */
    private static final long serialVersionUID = 70L;
    @JsonIgnore
    private transient List<DXFLWPolyline> builtUpAreaPolyLine = new ArrayList<>();

    public List<DXFLWPolyline> getBuiltUpAreaPolyLine() {
        return builtUpAreaPolyLine;
    }

    public void setBuiltUpAreaPolyLine(List<DXFLWPolyline> builtUpAreaPolyLine) {
        this.builtUpAreaPolyLine = builtUpAreaPolyLine;
    }

}
