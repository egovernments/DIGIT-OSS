/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
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
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.commons.contracts;

import org.egov.infra.persistence.validator.annotation.OptionalPattern;
import org.egov.infra.validation.regex.Constants;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.SafeHtml;

/**
 * 
 * @author subhash
 *
 */
public class BankBranchSearchRequest {

	private Integer bankId;

	private Integer bankBranchId;

	@Length(max = 50)
	@SafeHtml
	private String branchcode;

	@Length(max = 50)
	@SafeHtml
	private String branchMICR;

	@Length(max = 50)
	@SafeHtml
	private String branchaddress1;

	@SafeHtml
	@Length(max = 50)
	private String contactperson;

	@SafeHtml
	@Length(max = 15)
	@OptionalPattern(regex = Constants.MOBILE_NUM, message = "Please enter valid mobile number")
	private String branchphone;

	@Length(max = 250)
	@SafeHtml
	private String narration;

	private Boolean isactive;

	public Integer getBankId() {
		return bankId;
	}

	public void setBankId(Integer bankId) {
		this.bankId = bankId;
	}

	public Integer getBankBranchId() {
		return bankBranchId;
	}

	public void setBankBranchId(Integer bankBranchId) {
		this.bankBranchId = bankBranchId;
	}

	public String getBranchcode() {
		return branchcode;
	}

	public void setBranchcode(String branchcode) {
		this.branchcode = branchcode;
	}

	public String getBranchMICR() {
		return branchMICR;
	}

	public void setBranchMICR(String branchMICR) {
		this.branchMICR = branchMICR;
	}

	public String getBranchaddress1() {
		return branchaddress1;
	}

	public void setBranchaddress1(String branchaddress1) {
		this.branchaddress1 = branchaddress1;
	}

	public String getContactperson() {
		return contactperson;
	}

	public void setContactperson(String contactperson) {
		this.contactperson = contactperson;
	}

	public String getBranchphone() {
		return branchphone;
	}

	public void setBranchphone(String branchphone) {
		this.branchphone = branchphone;
	}

	public String getNarration() {
		return narration;
	}

	public void setNarration(String narration) {
		this.narration = narration;
	}

	public Boolean getIsactive() {
		return isactive;
	}

	public void setIsactive(Boolean isactive) {
		this.isactive = isactive;
	}

}
