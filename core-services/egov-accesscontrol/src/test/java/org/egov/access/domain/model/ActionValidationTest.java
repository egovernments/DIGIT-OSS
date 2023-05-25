package org.egov.access.domain.model;

import org.junit.Test;

public class ActionValidationTest {

	@Test
	public void testActionValidationContainsInfoAboutAnActionIsAllowedOrNot() {
		ActionValidation actionValidation = ActionValidation.builder().allowed(true).build();

		assert (actionValidation.isAllowed());
	}

}