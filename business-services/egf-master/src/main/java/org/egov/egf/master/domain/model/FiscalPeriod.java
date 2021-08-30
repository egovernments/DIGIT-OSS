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

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.egov.common.domain.model.Auditable;
import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * 
 * @author mani
 *
 */

/**
 * A financial year can have any number of fiscal periods. Each fiscal period
 * must have a start and end date. The start date of the first period and end
 * date of the last period will be the period of the financial year Dates cannot
 * overlap across periods – i.e. any given date cannot be in more than on fiscal
 * period.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(exclude = { "financialYear" }, callSuper = false)
public class FiscalPeriod extends Auditable {

	/**
	 * id is the unique identifier. it is generated internally
	 */
	private String id;

	@Length(min = 1, max = 25)
	@NotNull
	private String name = "";

	@NotNull
	private FinancialYear financialYear;

	/**
	 * startingDate is the date on which period starts.
	 */
	@NotNull
	private Date startingDate;

	/**
	 * endingDate is the date on which period ends.
	 */
	@NotNull
	private Date endingDate;

	/**
	 * active says whether fiscal period is active or not . Over a period system
	 * will have number of fiscal period. Reports ,searches,transactions will
	 * need to display this.If the active value is true then fiscal period is
	 * listed, if value is false it wont be listed
	 */

	@NotNull
	private Boolean active;

	/**
	 * isActiveForPosting refers whether posting allowed for the fiscal period
	 * or not . This value will be true for current year and few previous year
	 * for which data entry will be happening. Once the account is closed this
	 * value is set to false . All transactions will happen if and only if
	 * isActiveForPosting is true
	 */
	@NotNull
	private Boolean isActiveForPosting;

	/**
	 * isClosed refers whether the account is closed or not . Once the account
	 * is closed and balance is transferred this value is set to false if the
	 * account is closed no transaction can happen on that fiscal period.
	 */

	private Boolean isClosed;
}
