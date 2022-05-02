package org.bel.birthdeath.birth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EgBirthFatherInfo {

	private String id;

	private String aadharno;

	private String createdby;

	private Long createdtime;

	private String education;

	private String emailid;

	private String firstname;

	private String lastname;

	private String middlename;

	private String mobileno;

	private String nationality;

	private String proffession;

	private String religion;

	private String lastmodifiedby;

	private Long lastmodifiedtime;
	
	private String fullName;

}