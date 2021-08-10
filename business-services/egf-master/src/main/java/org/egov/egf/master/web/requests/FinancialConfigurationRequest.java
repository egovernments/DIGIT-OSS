package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.FinancialConfigurationContract;

import lombok.Data;
public @Data class FinancialConfigurationRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<FinancialConfigurationContract> financialConfigurations =new ArrayList<FinancialConfigurationContract>() ;
}