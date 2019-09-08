package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FiscalPeriodContract;

import lombok.Data;
public @Data class FiscalPeriodRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<FiscalPeriodContract> fiscalPeriods =new ArrayList<FiscalPeriodContract>() ;
}