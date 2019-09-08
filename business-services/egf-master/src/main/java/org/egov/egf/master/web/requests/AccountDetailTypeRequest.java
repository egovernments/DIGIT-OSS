package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;

import lombok.Data;
public @Data class AccountDetailTypeRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<AccountDetailTypeContract> accountDetailTypes =new ArrayList<AccountDetailTypeContract>() ;
}