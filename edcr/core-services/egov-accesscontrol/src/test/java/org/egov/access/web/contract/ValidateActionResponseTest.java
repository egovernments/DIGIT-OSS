package org.egov.access.web.contract;

import org.egov.access.web.contract.validateaction.ActionValidationContract;
import org.egov.access.web.contract.validateaction.ValidateActionResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ValidateActionResponseTest {

	@Test
	public void testThatValidateActionResponseContractContainsInfoAboutResponseInfoAndActionValidation() {
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		ActionValidationContract actionValidation = ActionValidationContract.builder().allowed("TRUE").build();
		ValidateActionResponse validateActionResponse = ValidateActionResponse.builder().responseInfo(responseInfo)
				.actionValidation(actionValidation).build();

		assertEquals(responseInfo, validateActionResponse.getResponseInfo());
		assertEquals(actionValidation, validateActionResponse.getActionValidation());
	}
}
