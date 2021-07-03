package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountEntityContract;

import lombok.Data;
public @Data class AccountEntityRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<AccountEntityContract> accountEntities =new ArrayList<AccountEntityContract>() ;
}