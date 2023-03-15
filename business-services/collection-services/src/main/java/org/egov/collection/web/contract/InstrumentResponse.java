package org.egov.collection.web.contract;

import lombok.Getter;
import lombok.Setter;
import org.egov.collection.model.Instrument;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Getter
@Setter
public class InstrumentResponse {
    private ResponseInfo responseInfo;
    private List<Instrument> instruments;
}
