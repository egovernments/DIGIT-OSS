/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any Long of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.egf.master.domain.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.egov.common.domain.model.Auditable;
import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
/**
 * 
 * @author mani
 *
 */
/*
 * 
 * 
 *This is the master list of bankbranches  operated by ULB
 */
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(exclude = { "bank" }, callSuper = false)

public class BankBranch extends Auditable {

	/**
	 * id is the unique identifier
	 */
	private String id;
	/**
	 * bank is the bank of the branch
	 */
	@NotNull
	private Bank bank;

	/**
	 * code is the branch code
	 */
	@NotNull
	@Length(max = 50, min = 1)
	private String code;
    /**
     * name is the branch name
     */
	@NotNull
	@Length(max = 50, min = 1)
	@Pattern(regexp = "^[a-zA-Z0-9_]*$")
	private String name;

	/**
	 * address is the address of the branch
	 */
	@NotNull
	@Length(max = 50, min = 1)
	private String address;

	/**
	 * address2 is the secondary address of the branch
	 */
	@Length(max = 50)
	private String address2;

	/**
	 * city is the name of the bank branches city
	 */
	
	@Length(max = 50)
	private String city;
	
	/**
	 * state is the name of the state
	 */

	@Length(max = 50)
	private String state;

	/**
	 * pincode is the pincode of the branch
	 */
	@Length(max = 50)
	private String pincode;

	/**
	 * phone is the phone number of the branch
	 */
	@Length(max = 15)
	private String phone;

	/**
	 * fax is the fax number of the branch
	 */
	@Length(max = 15)
	private String fax;

	/**
	 * contactPerson is the name of the person in contact 
	 */
	@Length(max = 50)
	private String contactPerson;

	/**
	 * active states whether branch is active. i.e is usable by the system or not 
	 * if not active it cannot be used 
	 */
	@NotNull
	private Boolean active;

	/**
	 * description is the more detailed description of the branch
	 */
	@Length(max = 256)
	private String description;

	/**
	 * micr is the micr code of the bank branch
	 */
	@Length(max = 50)
	private String micr;

}