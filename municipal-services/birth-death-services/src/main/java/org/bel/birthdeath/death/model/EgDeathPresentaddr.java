package org.bel.birthdeath.death.model;

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
public class EgDeathPresentaddr {

	private String id;

	private String buildingno;

	private String city;

	private String country;

	private String createdby;

	private Long createdtime;

	private String district;

	private String houseno;

	private String locality;

	private String pinno;

	private String state;

	private String streetname;

	private String tehsil;

	private String lastmodifiedby;

	private Long lastmodifiedtime;
	
	private String fullAddress;

}