package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.BankAccountContract;

import lombok.Data;
public @Data class BankAccountRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<BankAccountContract> bankAccounts =new ArrayList<BankAccountContract>() ;
}