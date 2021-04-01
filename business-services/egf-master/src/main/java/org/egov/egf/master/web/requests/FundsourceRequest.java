package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FundsourceContract;

import lombok.Data;
public @Data class FundsourceRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<FundsourceContract> fundsources =new ArrayList<FundsourceContract>() ;
}