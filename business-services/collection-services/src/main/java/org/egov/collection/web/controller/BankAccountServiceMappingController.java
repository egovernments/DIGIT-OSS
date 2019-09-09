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

import java.util.List;

import javax.validation.Valid;

import org.egov.collection.exception.CustomBindException;
import org.egov.collection.model.BankAccountServiceMappingSearchCriteria;
import org.egov.collection.service.BankAccountMappingService;
import org.egov.collection.util.CollectionMastersRequestValidator;
import org.egov.collection.web.contract.BankAccountServiceMapping;
import org.egov.collection.web.contract.BankAccountServiceMappingReq;
import org.egov.collection.web.contract.BankAccountServiceMappingResponse;
import org.egov.collection.web.contract.BankAccountServiceMappingSearchReq;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.collection.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/bankAccountServiceMapping")
@Slf4j
public class BankAccountServiceMappingController {

    @Autowired
    private BankAccountMappingService bankAccountMappingService;

    @Autowired
    private CollectionMastersRequestValidator collectionMastersRequestValidator;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @PostMapping(value = "/_create")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> create(@RequestBody @Valid BankAccountServiceMappingReq bankAccountServiceMappingReq,
            final BindingResult errors) {

        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }
        
        log.info("BankAccountServiceMapping Request::" + bankAccountServiceMappingReq);
        final ErrorResponse errorResponse = collectionMastersRequestValidator
                .validateBankAccountServiceRequest(bankAccountServiceMappingReq);
        if (errorResponse != null)
            return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.BAD_REQUEST);
        BankAccountServiceMappingReq bankAccountServiceReq = bankAccountMappingService
                .createBankAccountServiceMappingAsync(bankAccountServiceMappingReq);

        return getSuccessResponse(bankAccountServiceReq.getRequestInfo(), bankAccountServiceReq.getBankAccountServiceMapping());
    }

    @PostMapping(value = "/_search")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> search(@ModelAttribute BankAccountServiceMappingSearchReq bankAccountServiceMappingSearchReq,
            final BindingResult modelAttributeBindingResult,
            @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper) {

        log.info("Search request for BankAccount service mapping :: " + bankAccountServiceMappingSearchReq);

        BankAccountServiceMappingSearchCriteria searchCriteria = BankAccountServiceMappingSearchCriteria.builder()
                .bankAccount(bankAccountServiceMappingSearchReq.getBankAccount())
                .businessDetails(bankAccountServiceMappingSearchReq.getBusinessDetails())
                .tenantId(bankAccountServiceMappingSearchReq.getTenantId()).build();

        final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
        final ErrorResponse errorResponse = collectionMastersRequestValidator.validateBankAccountSearchRequest(searchCriteria);

        if (errorResponse != null)
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);

        List<org.egov.collection.model.BankAccountServiceMapping> bankAccountServiceMappings = bankAccountMappingService
                .searchBankAccountService(searchCriteria);

        List<BankAccountServiceMapping> contractBankServiceMappings = new BankAccountServiceMapping()
                .toContractList(bankAccountServiceMappings);

        return getSuccessResponse(requestInfo, contractBankServiceMappings);
    }

    private ResponseEntity<?> getSuccessResponse(RequestInfo requestInfo,
            List<BankAccountServiceMapping> bankAccountServiceMappingList) {
        BankAccountServiceMappingResponse response = new BankAccountServiceMappingResponse();
        response.setBankAccountServiceMapping(bankAccountServiceMappingList);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());
        response.setResponseInfo(responseInfo);
        return new ResponseEntity<BankAccountServiceMappingResponse>(response, HttpStatus.OK);
    }
}
