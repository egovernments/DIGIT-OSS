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
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author mani
 */
@AllArgsConstructor
@NoArgsConstructor
@Service
@Builder
@Getter
@Setter
@EqualsAndHashCode(exclude = { "parent" }, callSuper = false)

/**
 * 
 * Fund is a defining concept in municipal accounting – where it is required to
 * segregate all accounting transactions into designated funds. Each fund needs
 * to be treated as an independent accounting entity – in other words, all
 * vouchers within a fund must be self-balancing and balance sheets and
 * Income/Expenditure reports must be generated for each fund. A hierarchy of
 * funds may be defined – i.e. each fund can have multiple sub-funds and so on.
 */

public class Fund extends Auditable {

	/**
	 * id is the unique field .
	 */
	protected String id;

	/**
	 * name is the name of the fund . Example :Municipal Fund,Capital Fund. Also
	 * name is unique.
	 */
	@Length(max = 50, min = 2)
	@NotNull
	protected String name;

	/**
	 * code is a unique number given to each fund . ULB may refer this for the
	 * short name
	 */
	@Length(max = 50, min = 2)
	@NotNull
	protected String code;
	/**
	 * identifier appears as prefix in all the vouchers accounted in the books
	 * of the Fund. Each fund must have an identifier – each voucher belonging
	 * to a fund must have the identifier embedded in the voucher number for
	 * easy identification. Fund is taken at a voucher head level for each
	 * voucher transaction.
	 */
	@NotNull
	protected Character identifier;

	/**
	 * parent adding a parent will create the fund as a sub-fund (child) of a
	 * fund already created (parent fund).
	 * 
	 */
	protected Fund parent;
	/**
	 * active is a boolean value which says whether fund is in use or not . If
	 * Fund is active, then accounting of transactions under the fund is
	 * enabled. If Fund becomes inactive, and no transactions can be accounted
	 * under the Fund.
	 */
	@NotNull
	protected Boolean active;

	/**
	 * isParent is updated internally so that system can identify whether the
	 * fund is parent or child. Only child which is not parent for any other
	 * fund can only participate in transaction .
	 */

	protected Boolean isParent;

	/**
	 * level identifies what is the level of the fund in the tree structure. Top
	 * most parent will have level 0 and its child will have level as 1
	 * 
	 */

	@NotNull
	protected Long level;

	public void add() {
		if (parent == null) {
			level = 0l;

		} else {
			level = parent.getLevel() + 1;
		}
	}

	public void update() {
		if (parent == null) {
			level = 0l;

		} else {
			level = parent.getLevel() + 1;
		}
	}

}
