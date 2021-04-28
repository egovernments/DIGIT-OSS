package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.BankContract;

import lombok.Data;
public @Data class BankRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<BankContract> banks =new ArrayList<BankContract>() ;
}