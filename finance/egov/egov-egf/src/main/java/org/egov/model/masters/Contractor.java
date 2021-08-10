/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
package org.egov.model.masters;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.egov.commons.Bank;
import org.egov.commons.EgwStatus;
import org.egov.commons.utils.EntityType;
import org.egov.enums.ContractorTypeEnum;
import org.egov.infra.persistence.entity.AbstractAuditable;
import org.egov.infra.persistence.validator.annotation.OptionalPattern;
import org.egov.infra.persistence.validator.annotation.Required;
import org.egov.infra.persistence.validator.annotation.Unique;
import org.egov.infra.validation.regex.Constants;
import org.egov.utils.FinancialConstants;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.SafeHtml;

@Entity
@Table(name = "EGF_CONTRACTOR")
@Unique(id = "id", tableName = "EGF_CONTRACTOR", columnName = { "code", "tinNumber" }, fields = { "code",
        "tinNumber" }, enableDfltMsg = true)
@SequenceGenerator(name = Contractor.SEQ_EGF_CONTRACTOR, sequenceName = Contractor.SEQ_EGF_CONTRACTOR, allocationSize = 1)
public class Contractor extends AbstractAuditable implements EntityType {

    private static final long serialVersionUID = 2507334170114202599L;

    public static final String SEQ_EGF_CONTRACTOR = "SEQ_EGF_CONTRACTOR";

    @Id
    @GeneratedValue(generator = SEQ_EGF_CONTRACTOR, strategy = GenerationType.SEQUENCE)
    private Long id;

    @NotNull
    @SafeHtml
    @Length(max = 50, message = "Maximum of 50 Characters allowed for Code")
    @OptionalPattern(regex = FinancialConstants.alphaNumericwithspecialchar, message = "Special Characters are not allowed in Code")
    @Column(updatable = false)
    private String code;

    @NotNull
    @SafeHtml
    @Required(message = "Please Enter the Name")
    @OptionalPattern(regex = FinancialConstants.alphaNumericwithspecialcharForContraWOAndSupplierName, message = "Special Characters are not allowed in Name")
    @Length(max = 100, message = "Maximum of 100 Characters allowed for Name")
    private String name;

    @NotNull
    @SafeHtml
    @Length(max = 250, message = "Maximum of 250 Characters allowed for Correspondence Address")
    @OptionalPattern(regex = FinancialConstants.ALPHANUMERICWITHALLSPECIALCHAR, message = "Special characters are not allowed in correspondence address")
    private String correspondenceAddress;

    @SafeHtml
    @Length(max = 250, message = "Maximum of 250 Characters allowed for Payment Address")
    @OptionalPattern(regex = FinancialConstants.ALPHANUMERICWITHALLSPECIALCHAR, message = "Special characters are not allowed in payment address")
    private String paymentAddress;

    @NotNull
    @SafeHtml
    @Length(max = 100, message = "Maximum of 100 Characters allowed for Contact Person")
    @OptionalPattern(regex = Constants.ALPHANUMERIC_WITHSPACE, message = "Special Characters are not allowed in Contact Person")
    private String contactPerson;

    @SafeHtml
    @OptionalPattern(regex = Constants.EMAIL, message = "Invalid Email")
    @Length(max = 100, message = "Maximum of 100 Characters allowed for Email")
    private String email;

    @SafeHtml
    @Length(max = 1024, message = "Maximum of 1024 Characters allowed for Narration")
    @OptionalPattern(regex = FinancialConstants.ALPHANUMERICWITHALLSPECIALCHAR, message = "Special Characters are not allowed in narration")
    private String narration;

    @SafeHtml
    @Length(max = 10, message = "PAN No Field length should be 10 and it should be in the format XXXXX1234X")
    @OptionalPattern(regex = Constants.PANNUMBER, message = "Enter the PAN No in correct format - XXXXX1234X")
    @Column(updatable = false)
    private String panNumber;

    @NotNull
    @SafeHtml
    @Length(min = 15, max = 15, message = "Maximum of 15 Characters allowed for TIN/GST No")
    @OptionalPattern(regex = Constants.ALPHANUMERIC, message = "Special Characters are not allowed in TIN/GST No")
    @Column(updatable = false)
    private String tinNumber;

    @ManyToOne
    @JoinColumn(name = "bank")
    private Bank bank;

    @SafeHtml
    @Length(min = 11, max = 11, message = "Maximum of 11 Characters allowed for IFSC Code")
    @OptionalPattern(regex = Constants.ALPHANUMERIC, message = "Special Characters are not allowed in IFSC Code")
    private String ifscCode;

    @SafeHtml
    @Length(max = 22, message = "Maximum of 22 Characters allowed for Bank Account")
    @OptionalPattern(regex = FinancialConstants.numericwithoutspecialchar, message = "Only allowed numeric in account No")
    private String bankAccount;

    @SafeHtml
    @NotNull
    @Length(max = 10)
    @OptionalPattern(regex = Constants.MOBILE_NUM, message = "Please enter valid mobile number")
    private String mobileNumber;

    @SafeHtml
    @Length(max = 21, message = "Maximum of 21 Characters allowed for Registration No")
    @OptionalPattern(regex = FinancialConstants.alphaNumericwithoutspecialchar, message = "Special Characters are not allowed in Registration No")
    private String registrationNumber;

    @SafeHtml
    @Length(max = 24, message = "Maximum of 20 Characters allowed for EPF No")
    @OptionalPattern(regex = FinancialConstants.alphaNumericwithoutspecialchar, message = "Special Characters are not allowed in EPF No")
    private String epfNumber;

    @SafeHtml
    @Length(max = 21, message = "Maximum of 17 Characters allowed for ESI No")
    @OptionalPattern(regex = FinancialConstants.numericwithoutspecialchar, message = "Special Characters are not allowed in ESI No")
    private String esiNumber;

    @SafeHtml
    @NotNull
    @Length(max = 250, message = "Maximum of 250 Characters allowed for GST Registered State")
    private String gstRegisteredState;

    @Enumerated(EnumType.STRING)
    @Column(name = "contractortype")
    private ContractorTypeEnum contractorType;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "status")
    private EgwStatus status;

    @Override
    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getCorrespondenceAddress() {
        return correspondenceAddress;
    }

    public void setCorrespondenceAddress(final String correspondenceAddress) {
        this.correspondenceAddress = correspondenceAddress;
    }

    public String getPaymentAddress() {
        return paymentAddress;
    }

    public void setPaymentAddress(final String paymentAddress) {
        this.paymentAddress = paymentAddress;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(final String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(final String narration) {
        this.narration = narration;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(final String panNumber) {
        this.panNumber = panNumber;
    }

    public String getTinNumber() {
        return tinNumber;
    }

    public void setTinNumber(final String tinNumber) {
        this.tinNumber = tinNumber;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(final Bank bank) {
        this.bank = bank;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(final String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(final String bankAccount) {
        this.bankAccount = bankAccount;
    }

    @Override
    public String getBankaccount() {

        return bankAccount;
    }

    @Override
    public String getBankname() {

        if (bank == null)
            return "";
        else
            return bank.getName();
    }

    @Override
    public String getIfsccode() {

        return ifscCode;
    }

    @Override
    public String getPanno() {

        return panNumber;
    }

    @Override
    public String getTinno() {

        return tinNumber;
    }

    @Override
    public String getModeofpay() {

        return null;
    }

    @Override
    public Integer getEntityId() {
        return Integer.valueOf(id.intValue());
    }

    @Override
    public String getEntityDescription() {

        return getName();
    }

    @Override
    public EgwStatus getEgwStatus() {

        return status;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(final String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(final Long id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(final String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public EgwStatus getStatus() {
        return status;
    }

    public void setStatus(final EgwStatus status) {
        this.status = status;
    }

    public String getEpfNumber() {
        return epfNumber;
    }

    public void setEpfNumber(final String epfNumber) {
        this.epfNumber = epfNumber;
    }

    public String getEsiNumber() {
        return esiNumber;
    }

    public void setEsiNumber(final String esiNumber) {
        this.esiNumber = esiNumber;
    }

    public String getGstRegisteredState() {
        return gstRegisteredState;
    }

    public void setGstRegisteredState(final String gstRegisteredState) {
        this.gstRegisteredState = gstRegisteredState;
    }

    public ContractorTypeEnum getContractorType() {
        return contractorType;
    }

    public void setContractorType(ContractorTypeEnum contractorType) {
        this.contractorType = contractorType;
    }
}