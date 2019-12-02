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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.PaymentResponse;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.ReceiptStatus;
import org.egov.collection.service.PaymentService;
import org.egov.collection.service.PaymentWorkflowService;
import org.egov.collection.util.PaymentValidator;
import org.egov.collection.web.contract.PaymentWorkflowRequest;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.collection.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/payments")
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentWorkflowService workflowService;

    @Autowired
    private PaymentValidator paymentValidator;

    @Value("#{'${search.ignore.status}'.split(',')}")
    private List<String> searchIgnoreStatus;

    @RequestMapping(value = "/_search", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<PaymentResponse> search(@ModelAttribute PaymentSearchCriteria paymentSearchCriteria,
                                             @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper) {

        final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

        // Only do this if there is no receipt number search
        // Only do this when search ignore status has been defined in
        // application.properties
        // Only do this when status has not been already provided for the search
        if ((CollectionUtils.isEmpty(paymentSearchCriteria.getReceiptNumbers()))
                && !searchIgnoreStatus.isEmpty()
                && (CollectionUtils.isEmpty(paymentSearchCriteria.getStatus()))) {
            // Do not return ignored status for receipts by default
            Set<String> defaultStatus = new HashSet<>();
            for (ReceiptStatus receiptStatus : ReceiptStatus.values()) {
                if (!searchIgnoreStatus.contains(receiptStatus.toString())) {
                    defaultStatus.add(receiptStatus.toString());
                }
            }
            paymentSearchCriteria.setInstrumentStatus(defaultStatus);
        }
        List<Payment> payments = paymentService.getPayments(requestInfo, paymentSearchCriteria);

        return getSuccessResponse(payments, requestInfo);
    }

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<PaymentResponse> create(@RequestBody @Valid PaymentRequest paymentRequest) {

        Payment payment = paymentService.createPayment(paymentRequest);
        return getSuccessResponse(Collections.singletonList(payment), paymentRequest.getRequestInfo());

    }

    @RequestMapping(value = "/_workflow", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> workflow(@RequestBody @Valid PaymentWorkflowRequest receiptWorkflowRequest) {

        List<Payment> payments = workflowService.performWorkflow(receiptWorkflowRequest);
        return getSuccessResponse(payments, receiptWorkflowRequest.getRequestInfo());
    }

    @RequestMapping(value = "/_update", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody @Valid PaymentRequest paymentRequest) {
        List<Payment> payments = paymentService.updatePayment(paymentRequest);
        return getSuccessResponse(payments, paymentRequest.getRequestInfo());
    }

    @RequestMapping(value = "/_validate", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> validate(@RequestBody @Valid PaymentRequest paymentRequest) {

        Payment payment = paymentService.vaidateProvisonalPayment(paymentRequest);;
        return getSuccessResponse(Collections.singletonList(payment), paymentRequest.getRequestInfo());

    }


    private ResponseEntity<PaymentResponse> getSuccessResponse(List<Payment> payments, RequestInfo requestInfo) {
        final ResponseInfo responseInfo = ResponseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());

        PaymentResponse paymentResponse = new PaymentResponse(responseInfo, payments);
        return new ResponseEntity<>(paymentResponse, HttpStatus.OK);
    }
}