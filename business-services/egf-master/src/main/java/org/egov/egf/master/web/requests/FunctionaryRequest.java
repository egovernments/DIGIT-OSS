package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FunctionaryContract;

import lombok.Data;
public @Data class FunctionaryRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<FunctionaryContract> functionaries =new ArrayList<FunctionaryContract>() ;
}