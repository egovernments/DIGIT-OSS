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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.PaymentResponse;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.service.MigrationService;
import org.egov.collection.service.PaymentService;
import org.egov.collection.service.PaymentWorkflowService;
import org.egov.collection.web.contract.PaymentWorkflowRequest;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.collection.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentWorkflowService workflowService;

    @Autowired
    private MigrationService migrationService;

    @RequestMapping(path = {"/_search","/{moduleName}/_search"}, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> search(@ModelAttribute PaymentSearchCriteria paymentSearchCriteria,
                                             @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
                                             @PathVariable @Nullable String moduleName) {

		final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		if (paymentSearchCriteria.getIsCountRequest()) {

			if (CollectionUtils.isEmpty(paymentSearchCriteria.getBusinessServices())
					|| StringUtils.isEmpty(paymentSearchCriteria.getTenantId())) {
				throw new CustomException("EGCL_PAYMENT_COUNT_ERROR",
						"both of tenantid and businessServices is mandatory for count search");
			}

			Long count = paymentService.getpaymentcountForBusiness(paymentSearchCriteria.getTenantId(),
					paymentSearchCriteria.getBusinessServices().iterator().next());
			ResponseInfo responseInfo = ResponseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
			responseInfo.setStatus(HttpStatus.OK.toString());
			
			Map<String, Object> responseMap = new HashMap<>();
			responseMap.put("Count", count);
			responseMap.put("ResponseInfo", responseInfo);
			
			return new ResponseEntity<>(responseMap, HttpStatus.OK);
		} else {
			List<Payment> payments = paymentService.getPayments(requestInfo, paymentSearchCriteria, moduleName);
			return getSuccessResponse(payments, requestInfo);
		}
    }

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<PaymentResponse> create(@RequestBody @Valid PaymentRequest paymentRequest) {

        Payment payment = paymentService.createPayment(paymentRequest);
        return getSuccessResponse(Collections.singletonList(payment), paymentRequest.getRequestInfo());

    }


   @RequestMapping(value = "/{moduleName}/_workflow", method = RequestMethod.POST)
   @ResponseBody
   public ResponseEntity<?> workflow(@RequestBody @Valid PaymentWorkflowRequest receiptWorkflowRequest, @PathVariable String moduleName) {

        List<Payment> payments = workflowService.performWorkflow(receiptWorkflowRequest);
        return getSuccessResponse(payments, receiptWorkflowRequest.getRequestInfo());
    }

//    @RequestMapping(value = "/_update", method = RequestMethod.POST)
//    @ResponseBody
//    public ResponseEntity<?> update(@RequestBody @Valid PaymentRequest paymentRequest) {
//        List<Payment> payments = paymentService.updatePayment(paymentRequest);
//        return getSuccessResponse(payments, paymentRequest.getRequestInfo());
//    }

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

    @RequestMapping(value = "/_migrate", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> workflow(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,@RequestParam(required = false) Integer offset,
                                      @RequestParam(required = false) String tenantId, @RequestParam(required = true) Integer batchSize) throws JsonProcessingException {

        if(null == offset)
            offset = 0;

        migrationService.migrate(requestInfoWrapper.getRequestInfo(), offset, batchSize, tenantId);
        return new ResponseEntity<>(HttpStatus.OK );

    }

    @RequestMapping(value = "/_plainsearch", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<PaymentResponse> plainSearch(@ModelAttribute PaymentSearchCriteria paymentSearchCriteria,
                                                       @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper) {

        final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

        List<Payment> payments = paymentService.plainSearch(paymentSearchCriteria);

        return getSuccessResponse(payments, requestInfo);
    }

}
