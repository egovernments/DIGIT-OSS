package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.ChartOfAccountDetailContract;

import lombok.Data;
public @Data class ChartOfAccountDetailRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<ChartOfAccountDetailContract> chartOfAccountDetails =new ArrayList<ChartOfAccountDetailContract>() ;
}