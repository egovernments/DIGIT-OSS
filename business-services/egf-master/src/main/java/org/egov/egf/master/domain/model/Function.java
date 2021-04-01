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

/**
 * @author mani
 */
import javax.validation.constraints.NotNull;

import org.egov.common.domain.annotation.Unique;
import org.egov.common.domain.model.Auditable;
import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(exclude = { "parentId" }, callSuper = false)
/**
 * 
 * ULB activates are carried out by the concerned Departments . In each
 * department again multiple activities are carried out and these activities are
 * grouped as functions .Common functions enabled across all ULBs shall be
 * managed in Central Monitoring Cell based on the requirements for addition,
 * deletion and modification of functions from the ULBs.
 * 
 */

public class Function extends Auditable {

	/**
	 * id is the unique identifier .
	 */
	private String id;

	/**
	 * name is the name of the function .
	 */
	@Length(max = 128, min = 2)
	@NotNull
	@Unique
	private String name;

	/**
	 * code is a unique number given to each function . ULBs may refer this for
	 * the short name.
	 */
	@Length(max = 16, min = 2)
	@NotNull
	private String code;
	/**
	 * level identifies what is the level of the function in the tree structure.
	 * Top most parent will have level 0 and its child will have level as 1
	 * 
	 */
	@NotNull
	private Integer level;

	/**
	 * active is a boolean value which says whether function is in use or not .
	 * If Function is active, then accounting of transactions under the Function
	 * is enabled. If Function becomes inactive, and no transactions can be
	 * accounted under the Function. Only leaf function can be used in
	 * transaction ie function which is not parent to any other function
	 */
	@NotNull
	private Boolean active;

	private Function parentId;

	public void add() {
		if (parentId == null) {
			level = 0;

		} else {
			level = parentId.getLevel() + 1;
		}
	}

	public void update() {
		if (parentId == null) {
			level = 0;

		} else {
			level = parentId.getLevel() + 1;
		}
	}

}
