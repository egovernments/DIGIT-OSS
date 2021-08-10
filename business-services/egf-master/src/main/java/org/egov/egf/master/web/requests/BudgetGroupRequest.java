package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.BudgetGroupContract;

import lombok.Data;
public @Data class BudgetGroupRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<BudgetGroupContract> budgetGroups =new ArrayList<BudgetGroupContract>() ;
}