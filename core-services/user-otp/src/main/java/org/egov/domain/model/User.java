package org.egov.domain.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@EqualsAndHashCode
@NoArgsConstructor
public class User {
	private Long id;
	private String email;
	private String mobileNumber;
}

