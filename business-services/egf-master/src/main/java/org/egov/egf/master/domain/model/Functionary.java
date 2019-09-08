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

import org.egov.common.domain.model.Auditable;
import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 * @author mani
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
/*
 * Functionary is considered as another cost center. In the government set-up,
 * demands for expenditure are drawn by the department discharging the functions
 * and become the responsibility center for the assigned functions. Functionary
 * group represents this. Each sub-level within this group typically can
 * represent the organisational structure within the ULB. This level is used
 * only for the internal control of the ULB.
 */
public class Functionary extends Auditable {

	/**
	 * id is the unique identifier and it is generated internally
	 */
	private String id;

	/**
	 * code is uniue identifier and ULB may refer this for short name.
	 */
	@NotNull
	@Length(max = 16, min = 1)
	private String code;

	/**
	 * name is the name of the functionary
	 */
	@NotNull
	@Length(max = 256, min = 1)
	private String name;

	/**
	 * active states whether the functionary is active or not . Only active
	 * functionaries will be used in transaction
	 */
	@NotNull
	private Boolean active;

}
