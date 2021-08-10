package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FunctionContract;

import lombok.Data;
public @Data class FunctionRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<FunctionContract> functions =new ArrayList<FunctionContract>() ;
}