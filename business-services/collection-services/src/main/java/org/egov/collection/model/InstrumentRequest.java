package org.egov.collection.model;

import lombok.Data;
import org.egov.common.contract.request.RequestInfo;

import java.util.ArrayList;
import java.util.List;

@Data
public class InstrumentRequest {
	private RequestInfo requestInfo = new RequestInfo();
	private List<Instrument> instruments = new ArrayList<>();
    private String ids;
}