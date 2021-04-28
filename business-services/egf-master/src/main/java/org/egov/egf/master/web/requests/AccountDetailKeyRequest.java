package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountDetailKeyContract;

import lombok.Data;
public @Data class AccountDetailKeyRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<AccountDetailKeyContract> accountDetailKeys =new ArrayList<AccountDetailKeyContract>() ;
}