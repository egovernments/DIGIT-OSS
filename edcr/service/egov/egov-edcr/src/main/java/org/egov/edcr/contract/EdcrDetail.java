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

package org.egov.edcr.contract;

import java.util.Date;
import java.util.List;

import org.egov.common.entity.edcr.Plan;

public class EdcrDetail {

    private String dxfFile;

    private String updatedDxfFile;

    private String planReport;

    private String transactionNumber;

    private Date applicationDate;

    private String applicationNumber;

    private String status;

    private String edcrNumber;

    private String tenantId;

    private String errors;

    private List<String> planPdfs;

    private Plan planDetail;

    private String permitNumber;

    private Date permitDate;

    private String appliactionType;

    private String applicationSubType;

    private String comparisonEdcrNumber;

    public String getPlanReport() {
        return planReport;
    }

    public void setPlanReport(String planReport) {
        this.planReport = planReport;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Plan getPlanDetail() {
        return planDetail;
    }

    public void setPlanDetail(Plan planDetail) {
        this.planDetail = planDetail;
    }

    public List<String> getPlanPdfs() {
        return planPdfs;
    }

    public void setPlanPdfs(List<String> planPdfs) {
        this.planPdfs = planPdfs;
    }

    public String getEdcrNumber() {
        return edcrNumber;
    }

    public void setEdcrNumber(String edcrNumber) {
        this.edcrNumber = edcrNumber;
    }

    public String getTransactionNumber() {
        return transactionNumber;
    }

    public void setTransactionNumber(String transactionNumber) {
        this.transactionNumber = transactionNumber;
    }

    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }

    public Date getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getDxfFile() {
        return dxfFile;
    }

    public void setDxfFile(String dxfFile) {
        this.dxfFile = dxfFile;
    }

    public String getUpdatedDxfFile() {
        return updatedDxfFile;
    }

    public void setUpdatedDxfFile(String updatedDxfFile) {
        this.updatedDxfFile = updatedDxfFile;
    }

    public String getErrors() {
        return errors;
    }

    public void setErrors(String errors) {
        this.errors = errors;
    }

    public String getPermitNumber() {
        return permitNumber;
    }

    public void setPermitNumber(String permitNumber) {
        this.permitNumber = permitNumber;
    }

    public Date getPermitDate() {
        return permitDate;
    }

    public void setPermitDate(Date permitDate) {
        this.permitDate = permitDate;
    }

    public String getAppliactionType() {
        return appliactionType;
    }

    public void setAppliactionType(String appliactionType) {
        this.appliactionType = appliactionType;
    }

    public String getApplicationSubType() {
        return applicationSubType;
    }

    public void setApplicationSubType(String applicationSubType) {
        this.applicationSubType = applicationSubType;
    }

    public String getComparisonEdcrNumber() {
        return comparisonEdcrNumber;
    }

    public void setComparisonEdcrNumber(String comparisonEdcrNumber) {
        this.comparisonEdcrNumber = comparisonEdcrNumber;
    }

    @Override
    public String toString() {
        return "EdcrDetail [transactionNumber=" + transactionNumber + ", applicationDate=" + applicationDate
                + ", applicationNumber=" + applicationNumber + ", status=" + status + ", edcrNumber=" + edcrNumber + ", tenantId="
                + tenantId + ", errors=" + errors + ", planPdfs=" + planPdfs + ", planDetail=" + planDetail + ", permitNumber="
                + permitNumber + ", permitDate=" + permitDate + ", appliactionType=" + appliactionType + ", applicationSubType="
                + applicationSubType + ", comparisonEdcrNumber=" + comparisonEdcrNumber + "]";
    }

}
