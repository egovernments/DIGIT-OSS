package org.egov.demand.web.validator;

import static org.egov.demand.util.Constants.BILL_GEN_MANDATORY_FIELDS_MISSING_KEY;
import static org.egov.demand.util.Constants.BILL_GEN_MANDATORY_FIELDS_MISSING_MSG;

import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

@Component
public class BillValidator {
	
	/**
	 * validtes the bill gen criteria
	 * 
	 * @param generateBillCriteria
	 */
	public void validateBillGenRequest(GenerateBillCriteria generateBillCriteria) {

		boolean demandIdNotProvided = null == generateBillCriteria.getDemandId();
			
		boolean payerDataNotProvided = (generateBillCriteria.getMobileNumber() == null
				&& generateBillCriteria.getEmail() == null);
		
		boolean isCombinationOfBusinessOrCosnumerCodeMissing = generateBillCriteria.getBusinessService() == null
				|| generateBillCriteria.getConsumerCode() == null;

		if (demandIdNotProvided && payerDataNotProvided && isCombinationOfBusinessOrCosnumerCodeMissing)
			throw new CustomException(BILL_GEN_MANDATORY_FIELDS_MISSING_KEY, BILL_GEN_MANDATORY_FIELDS_MISSING_MSG);

	}

	public void validateBillSearchCriteria(BillSearchCriteria billCriteria, Errors errors) {

		if (billCriteria.getBillId() == null && billCriteria.getIsActive() == null
				&& billCriteria.getIsCancelled() == null && billCriteria.getService() == null
				&& billCriteria.getConsumerCode() == null && billCriteria.getMobileNumber() == null
				&& billCriteria.getEmail() == null) {

			errors.rejectValue("service", "BILL_SEARCH_MANDATORY_FIELDS_MISSING",
					"Any one of the fields additional to tenantId is mandatory like service,"
							+ "consumerCode,billId,isActiv,isCanceled");
		} else if ((billCriteria.getConsumerCode() != null && billCriteria.getService() == null)) {

			errors.rejectValue("consumerCode", "BILL_SEARCH_CONSUMERCODE_BUSINESSSERVICE",
					"the consumerCode & Service values should be given together or mobilenumber/email can be given ");
		}
	}

}
