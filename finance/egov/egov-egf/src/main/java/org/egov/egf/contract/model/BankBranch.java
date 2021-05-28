package org.egov.egf.contract.model;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class BankBranch implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -1341882041083855081L;
    private Long id;
    private Bank bank;
    @SafeHtml
    private String code;
    @SafeHtml
    private String name;
    @SafeHtml
    private String address;
    @SafeHtml
    private String address2;
    @SafeHtml
    private String city;
    @SafeHtml
    private String state;
    @SafeHtml
    private String pincode;
    @SafeHtml
    private String phone;
    @SafeHtml
    private String fax;
    @SafeHtml
    private String contactPerson;
    private boolean active;
    @SafeHtml
    private String description;
    @SafeHtml
    private String micr;
    private AuditDetails auditDetails;

    public BankBranch(final Long id, final Bank bank, final String code, final String name, final String address,
            final String address2, final String city, final String state, final String pincode, final String phone,
            final String fax, final String contactPerson, final boolean active, final String description,
            final String micr, final AuditDetails auditDetails) {
        this.id = id;
        this.bank = bank;
        this.code = code;
        this.name = name;
        this.address = address;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.phone = phone;
        this.fax = fax;
        this.contactPerson = contactPerson;
        this.active = active;
        this.description = description;
        this.micr = micr;
        this.auditDetails = auditDetails;
    }

    public BankBranch() {
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(final Bank bank) {
        this.bank = bank;
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(final String address) {
        this.address = address;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(final String address2) {
        this.address2 = address2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(final String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(final String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(final String pincode) {
        this.pincode = pincode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(final String phone) {
        this.phone = phone;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(final String fax) {
        this.fax = fax;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(final String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(final boolean active) {
        this.active = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getMicr() {
        return micr;
    }

    public void setMicr(final String micr) {
        this.micr = micr;
    }

    public AuditDetails getAuditDetails() {
        return auditDetails;
    }

    public void setAuditDetails(final AuditDetails auditDetails) {
        this.auditDetails = auditDetails;
    }

}
