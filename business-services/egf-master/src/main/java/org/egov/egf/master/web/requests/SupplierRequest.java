package  org.egov.egf.master.web.requests;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.SupplierContract;

import lombok.Data;
public @Data class SupplierRequest {
private RequestInfo requestInfo = new RequestInfo();
private List<SupplierContract> suppliers =new ArrayList<SupplierContract>() ;
}