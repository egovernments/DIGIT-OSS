package org.egov.infra.microservice.models;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class BillDetailAdditional implements Serializable {

    @SafeHtml
    private String scheme;
    @SafeHtml
    private String subScheme;
    @SafeHtml
    private String businessReason;
    @SafeHtml
    private String narration;
    @SafeHtml
    private String payeeaddress;
    
    public BillDetailAdditional(String scheme, String subScheme, String businessReason,String narration,String payeeaddress) {
        this.scheme = scheme;
        this.subScheme = subScheme;
        this.businessReason = businessReason;
        this.narration = narration;
        this.payeeaddress = payeeaddress;
    }
    public BillDetailAdditional() {
    }
    public String getScheme() {
        return scheme;
    }
    public void setScheme(String scheme) {
        this.scheme = scheme;
    }
    public String getSubScheme() {
        return subScheme;
    }
    public void setSubScheme(String subScheme) {
        this.subScheme = subScheme;
    }
    public String getBusinessReason() {
        return businessReason;
    }
    public void setBusinessReason(String businessReason) {
        this.businessReason = businessReason;
    }
    public String getNarration() {
        return narration;
    }
    public void setNarration(String narration) {
        this.narration = narration;
    }
    public String getPayeeaddress() {
        return payeeaddress;
    }
    public void setPayeeaddress(String payeeaddress) {
        this.payeeaddress = payeeaddress;
    }
}
