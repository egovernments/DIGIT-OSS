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

package org.egov.edcr.web.controller.rest;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.util.Date;

import org.egov.common.entity.dcr.helper.EdcrApplicationInfo;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.edcr.entity.EdcrApplicationDetail;
import org.egov.edcr.service.EdcrApplicationDetailService;
import org.egov.edcr.service.EdcrExternalService;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class EdcrRestController {

    @Autowired
    private EdcrExternalService edcrExternalService;
    @Autowired
    private EdcrApplicationDetailService edcrApplicationDetailService;

    @GetMapping(value = "/approved-plan-details/by-edcr-number/{dcrNumber}", produces = APPLICATION_JSON_VALUE)
    public EdcrApplicationInfo validateEdcrPlanFile(@PathVariable final String dcrNumber) {
        EdcrApplicationDetail applicationDetail = edcrApplicationDetailService.findByDcrNumber(dcrNumber);
        if (applicationDetail == null) {
            ErrorDetail errorDetail = new ErrorDetail();
            errorDetail.setErrorCode(DcrConstants.ERROR_CODE_PLAN_NOT_EXIST);
            errorDetail.setErrorMessage(DcrConstants.ERROR_MSG_PLAN_NOT_EXIST);
            EdcrApplicationInfo applicationInfo = new EdcrApplicationInfo();
            applicationInfo.setErrorDetail(errorDetail);
            return applicationInfo;
        } else
            return edcrExternalService.loadEdcrApplicationDetails(dcrNumber);
    }

    @GetMapping(value = "/approved-report-ouput/by-edcr-number/{dcrNumber}")
    @ResponseBody
    public String getDcrReport(@PathVariable final String dcrNumber) {
        EdcrApplicationDetail applicationDetail = edcrApplicationDetailService.findByDcrNumber(dcrNumber);
        return applicationDetail.getReportOutputId().getFileStoreId();
    }

    @GetMapping("/converted-pdf/by-edcr-number/{dcrNumber}")
    @ResponseBody
    public String getConvertedPdfs(@PathVariable final String dcrNumber) {
        /*
         * EdcrApplicationDetail applicationDetail = edcrApplicationDetailService.findByDcrNumber(dcrNumber); List<EdcrPdfDetail>
         * edcrPdfDetails = applicationDetail.getEdcrPdfDetails(); if (edcrPdfDetails.size() > 0) { StringBuffer fileStoreIds =
         * new StringBuffer(); for (EdcrPdfDetail edcrPdfDetail : edcrPdfDetails) { if (edcrPdfDetail.getConvertedPdf() != null) {
         * fileStoreIds.append(edcrPdfDetail.getConvertedPdf().getFileStoreId()).append(","); } } return
         * !StringUtils.isBlank(fileStoreIds.toString()) ? fileStoreIds.toString().substring(0, fileStoreIds.length() - 1) :
         * StringUtils.EMPTY; } else { return StringUtils.EMPTY; }
         */
        return null;
    }

    @GetMapping(value = "/created-date/of-edcr-number/{dcrNumber}")
    @ResponseBody
    public Date getCreatedDateOfDCR(@PathVariable final String dcrNumber) {
        EdcrApplicationDetail applicationDetail = edcrApplicationDetailService.findByDcrNumber(dcrNumber);
        if (applicationDetail != null && applicationDetail.getCreatedDate() != null)
            return applicationDetail.getCreatedDate();
        return null;
    }

    @GetMapping(value = "/plan-permission-no/by-edcr-number/{dcrNumber}")
    @ResponseBody
    public String getEdcrPlanPermissionNo(@PathVariable final String dcrNumber) {
        EdcrApplicationDetail applicationDetail = edcrApplicationDetailService.findByDcrNumber(dcrNumber);
        if (applicationDetail != null)
            return applicationDetail.getApplication().getPlanPermitNumber();
        return null;
    }
}
