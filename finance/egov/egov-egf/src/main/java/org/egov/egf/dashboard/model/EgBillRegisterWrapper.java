package org.egov.egf.dashboard.model;

import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EgBillRegisterWrapper {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    @JsonProperty("egBillRegisterData")
    private List<EgBillRegisterData> egBillRegisterData;
    @JsonProperty("voucherHeaderData")
    private List<VoucherHeaderData> voucherHeaderData;
    public RequestInfo getRequestInfo() {
        return requestInfo;
    }
    public void setRequestInfo(RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }
    public List<EgBillRegisterData> getEgBillRegisterData() {
        return egBillRegisterData;
    }
    public void setEgBillRegisterData(List<EgBillRegisterData> egBillRegisterData) {
        this.egBillRegisterData = egBillRegisterData;
    }
    public List<VoucherHeaderData> getVoucherHeaderData() {
        return voucherHeaderData;
    }
    public void setVoucherHeaderData(List<VoucherHeaderData> voucherHeaderData) {
        this.voucherHeaderData = voucherHeaderData;
    }
    
    
}
