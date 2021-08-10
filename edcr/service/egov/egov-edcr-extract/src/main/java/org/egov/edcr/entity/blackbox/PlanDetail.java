package org.egov.edcr.entity.blackbox;

import org.egov.common.entity.edcr.Plan;
import org.kabeja.dxf.DXFDocument;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PlanDetail extends Plan {

    private static final long serialVersionUID = 76L;

    @JsonIgnore
    private DXFDocument doc;

    public DXFDocument getDoc() {
        return doc;
    }

    public void setDoc(DXFDocument doc) {
        this.doc = doc;
    }

    @JsonIgnore
    public DXFDocument getDxfDocument() {
        return doc;
    }

}
