package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.SchemeContract;

import lombok.Data;
public @Data class SchemeRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<SchemeContract> schemes =new ArrayList<SchemeContract>() ;
}