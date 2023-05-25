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
package org.egov.model.report;

import org.egov.commons.CChartOfAccounts;
import org.hibernate.validator.constraints.SafeHtml;

public class ChartOfAccountsReport {

    @SafeHtml
    private String accountCode;
    @SafeHtml
    private String accountName;
    @SafeHtml
    private String majorCode;
    private Long majorCodeId;
    private Long minorCodeId;
    @SafeHtml
    private String minorCode;
    @SafeHtml
    private String majorName;
    @SafeHtml
    private String minorName;
    @SafeHtml
    private String type;
    private Long purposeId;
    @SafeHtml
    private String purpose;
    private Boolean isActiveForPosting;
    private Boolean functionReqd;
    private Boolean budgetCheckReq;
    private Long detailTypeId;
    @SafeHtml
    private String accountDetailType;
    private CChartOfAccounts detailChartOfAccounts;
    private CChartOfAccounts majorChartOfAccounts;
    private CChartOfAccounts minorChartOfAccounts;

    public CChartOfAccounts getDetailChartOfAccounts() {
        return detailChartOfAccounts;
    }

    public void setDetailChartOfAccounts(final CChartOfAccounts detailChartOfAccounts) {
        this.detailChartOfAccounts = detailChartOfAccounts;
    }

    public CChartOfAccounts getMajorChartOfAccounts() {
        return majorChartOfAccounts;
    }

    public void setMajorChartOfAccounts(final CChartOfAccounts majorChartOfAccounts) {
        this.majorChartOfAccounts = majorChartOfAccounts;
    }

    public CChartOfAccounts getMinorChartOfAccounts() {
        return minorChartOfAccounts;
    }

    public void setMinorChartOfAccounts(final CChartOfAccounts minorChartOfAccounts) {
        this.minorChartOfAccounts = minorChartOfAccounts;
    }

    public String getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(final String accountCode) {
        this.accountCode = accountCode;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(final String accountName) {
        this.accountName = accountName;
    }

    public String getMajorCode() {
        return majorCode;
    }

    public void setMajorCode(final String majorCode) {
        this.majorCode = majorCode;
    }

    public String getMinorCode() {
        return minorCode;
    }

    public void setMinorCode(final String minorCode) {
        this.minorCode = minorCode;
    }

    public String getMajorName() {
        return majorName;
    }

    public void setMajorName(final String majorName) {
        this.majorName = majorName;
    }

    public String getMinorName() {
        return minorName;
    }

    public void setMinorName(final String minorName) {
        this.minorName = minorName;
    }

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public Long getPurposeId() {
        return purposeId;
    }

    public void setPurposeId(final Long purposeId) {
        this.purposeId = purposeId;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(final String purpose) {
        this.purpose = purpose;
    }

    public Boolean getIsActiveForPosting() {
        return isActiveForPosting;
    }

    public void setIsActiveForPosting(final Boolean isActiveForPosting) {
        this.isActiveForPosting = isActiveForPosting;
    }

    public Boolean getFunctionReqd() {
        return functionReqd;
    }

    public void setFunctionReqd(final Boolean functionReqd) {
        this.functionReqd = functionReqd;
    }

    public Boolean getBudgetCheckReq() {
        return budgetCheckReq;
    }

    public void setBudgetCheckReq(final Boolean budgetCheckReq) {
        this.budgetCheckReq = budgetCheckReq;
    }

    public Long getDetailTypeId() {
        return detailTypeId;
    }

    public void setDetailTypeId(final Long detailTypeId) {
        this.detailTypeId = detailTypeId;
    }

    public String getAccountDetailType() {
        return accountDetailType;
    }

    public void setAccountDetailType(final String accountDetailType) {
        this.accountDetailType = accountDetailType;
    }

    public Long getMajorCodeId() {
        return majorCodeId;
    }

    public void setMajorCodeId(final Long majorCodeId) {
        this.majorCodeId = majorCodeId;
    }

    public Long getMinorCodeId() {
        return minorCodeId;
    }

    public void setMinorCodeId(final Long minorCodeId) {
        this.minorCodeId = minorCodeId;
    }

}
