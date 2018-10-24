package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

public class InstrumentRequest {

    private RequestInfo requestInfo = new RequestInfo();

    private List<Instrument> instruments = new ArrayList<Instrument>();

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public List<Instrument> getInstruments() {
        return instruments;
    }

    public void setInstruments(List<Instrument> instruments) {
        this.instruments = instruments;
    }
}