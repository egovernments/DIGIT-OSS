package org.egov.access.web.contract;

import org.egov.access.web.contract.validateaction.ActionValidationContract;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ActionValidationContractTest {

	@Test
	public void testThatActionValidationContractContainsInfoAboutActionAllow() {
		ActionValidationContract actionValidation = ActionValidationContract.builder().allowed("TRUE").build();

		assertEquals("TRUE", actionValidation.getAllowed());
	}
}
