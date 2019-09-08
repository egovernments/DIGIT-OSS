package org.egov.user.domain.model;

import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class AddressTest {

	@Test
	public void test_invalid_should_return_false_when_all_fields_are_within_length_limit() {
		final Address address = Address.builder()
				.address(multiplyCharacter(300, "A"))
				.city(multiplyCharacter(300, "B"))
				.pinCode(multiplyCharacter(10, "A"))
				.build();

		assertFalse(address.isInvalid());
	}

	@Test
	public void test_invalid_should_return_true_when_pincode_length_is_greater_than_10() {
		final Address address = Address.builder()
				.address(multiplyCharacter(300, "A"))
				.city(multiplyCharacter(300, "A"))
				.pinCode(multiplyCharacter(11, "A"))
				.build();

		assertTrue(address.isInvalid());
		assertTrue(address.isPinCodeInvalid());
	}

	@Test
	public void test_invalid_should_return_true_when_address_length_is_greater_than_300_characters() {
		final Address address = Address.builder()
				.address(multiplyCharacter(301, "A"))
				.city(multiplyCharacter(300, "E"))
				.pinCode(multiplyCharacter(10, "A"))
				.build();

		assertTrue(address.isInvalid());
		assertTrue(address.isAddressInvalid());
	}

	@Test
	public void test_invalid_should_return_true_when_city_length_is_greater_than_300_characters() {
		final Address address = Address.builder()
				.address(multiplyCharacter(300, "A"))
				.city(multiplyCharacter(301, "D"))
				.pinCode(multiplyCharacter(10, "C"))
				.build();

		assertTrue(address.isInvalid());
		assertTrue(address.isCityInvalid());
	}

	private String multiplyCharacter(int count, String character) {
		return String.join("", Collections.nCopies(count, character));
	}

}