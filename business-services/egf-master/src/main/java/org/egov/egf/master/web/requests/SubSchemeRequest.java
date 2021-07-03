package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.SubSchemeContract;

import lombok.Data;
public @Data class SubSchemeRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<SubSchemeContract> subSchemes =new ArrayList<SubSchemeContract>() ;
}