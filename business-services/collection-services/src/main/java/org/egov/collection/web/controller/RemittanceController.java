/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.collection.web.controller;

import java.util.Collections;
import java.util.List;

import javax.validation.Valid;

import org.egov.collection.service.RemittanceService;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceRequest;
import org.egov.collection.web.contract.RemittanceResponse;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.collection.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/remittances")
@Slf4j
public class RemittanceController {

    @Autowired
    private RemittanceService remittanceService;

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<RemittanceResponse> create(@RequestBody @Valid RemittanceRequest remittanceRequest) {

        Remittance remittanceInfo = remittanceService.createRemittance(remittanceRequest);
        return getSuccessResponse(Collections.singletonList(remittanceInfo), remittanceRequest.getRequestInfo());

    }

    @RequestMapping(value = "/_search", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<RemittanceResponse> search(@ModelAttribute RemittanceSearchRequest remittanceSearchRequest,
            @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper) {

        final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
        List<Remittance> remittances = remittanceService.getRemittances(requestInfo, remittanceSearchRequest);
        return getSuccessResponse(remittances, requestInfo);
    }

    @RequestMapping(value = "/_update", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody @Valid RemittanceRequest remittanceRequest) {

        Remittance remittanceInfo = remittanceService.updateRemittance(remittanceRequest);

        return getSuccessResponse(Collections.singletonList(remittanceInfo), remittanceRequest.getRequestInfo());
    }

    private ResponseEntity<RemittanceResponse> getSuccessResponse(List<Remittance> remittances,
            RequestInfo requestInfo) {
        final ResponseInfo responseInfo = ResponseInfoFactory
                .createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());

        RemittanceResponse remittanceResponse = new RemittanceResponse(responseInfo, remittances);
        return new ResponseEntity<>(remittanceResponse, HttpStatus.OK);
    }
}