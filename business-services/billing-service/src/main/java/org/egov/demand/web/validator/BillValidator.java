package org.egov.demand.web.validator;

import static org.egov.demand.util.Constants.BILL_GEN_MANDATORY_FIELDS_MISSING_KEY;
import static org.egov.demand.util.Constants.BILL_GEN_MANDATORY_FIELDS_MISSING_MSG;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BillV2.BillStatus;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.demand.model.UpdateBillCriteria;
import org.egov.demand.util.Constants;
import org.egov.demand.util.Util;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;

@Component
public class BillValidator {
	
	@Autowired
	private Util util;
	
	/**
	 * validtes the bill gen criteria
	 * 
	 * @param generateBillCriteria
	 */
	public void validateBillGenRequest(GenerateBillCriteria generateBillCriteria, RequestInfo requestInfo) {
		
		util.validateTenantIdForUserType(generateBillCriteria.getTenantId(), requestInfo);

		boolean demandIdNotProvided = null == generateBillCriteria.getDemandId();
			
		boolean payerDataNotProvided = (generateBillCriteria.getMobileNumber() == null
				&& generateBillCriteria.getEmail() == null);
		
		boolean isCombinationOfBusinessOrCosnumerCodeMissing = generateBillCriteria.getBusinessService() == null
				|| CollectionUtils.isEmpty(generateBillCriteria.getConsumerCode());

		if (demandIdNotProvided && payerDataNotProvided && isCombinationOfBusinessOrCosnumerCodeMissing)
			throw new CustomException(BILL_GEN_MANDATORY_FIELDS_MISSING_KEY, BILL_GEN_MANDATORY_FIELDS_MISSING_MSG);

	}

	public void validateBillSearchCriteria(BillSearchCriteria billCriteria, RequestInfo requestInfo) {

		util.validateTenantIdForUserType(billCriteria.getTenantId(), requestInfo);
		
		if (billCriteria.getBillId() == null && CollectionUtils.isEmpty(billCriteria.getConsumerCode())
				&& billCriteria.getMobileNumber() == null && billCriteria.getEmail() == null) {

			throw new CustomException("EGBS_MANDATORY_FIELDS_ERROR",
					"BILL_SEARCH_MANDATORY_FIELDS_MISSING Any one of the fields additional to tenantId is mandatory like consumerCode,billId, mobileNumber or email");
		} else if ((billCriteria.getConsumerCode() != null && billCriteria.getService() == null)) {

			throw new CustomException("BILL_SEARCH_CONSUMERCODE_BUSINESSSERVICE",
					" the consumerCode & Service values should be given together or mobilenumber/email can be given ");
		}
	}

	public void validateBillSearchRequest(UpdateBillCriteria cancelBillCriteria) {

		cancelBillCriteria.setStatusToBeUpdated(BillStatus.CANCELLED);
		JsonNode additionalDetails = cancelBillCriteria.getAdditionalDetails();
		Map<String, String> errorMap = new HashMap<>();

		JsonNode reasonMsg = additionalDetails.get(Constants.CANCELLATION_REASON_MSG);
		JsonNode reasonCode = additionalDetails.get(Constants.CANCELLATION_REASON_CODE);

		if (null != reasonCode && reasonCode.isTextual()) {
			if (StringUtils.isEmpty(reasonCode.textValue()))
				errorMap.put(Constants.CANCELL_REASON_CODE_NOT_FOUND, Constants.CANCELL_REASON_CODE_EMPTY_MSG);
		} else {
			errorMap.put(Constants.CANCELL_REASON_CODE_NOT_FOUND, Constants.CANCELL_REASON_CODE_NOT_FOUND_MSG);
		}

		if (null != reasonMsg && reasonMsg.isTextual()) {
			if (StringUtils.isEmpty(reasonMsg.textValue()))
				errorMap.put(Constants.CANCELL_REASON_MSG_NOT_FOUND, Constants.CANCELL_REASON_MSG_EMPTY_MSG);
		} else {
			errorMap.put(Constants.CANCELL_REASON_MSG_NOT_FOUND, Constants.CANCELL_REASON_MSG_NOT_FOUND_MSG);
		}

		if (!CollectionUtils.isEmpty(errorMap)) {
			throw new CustomException(errorMap);
		}
	}

}
