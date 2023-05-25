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

package org.egov.egf.master.persistence.entity;

import javax.validation.constraints.NotNull;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Fund;
import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class FundEntity extends AuditableEntity {

	public static final String TABLE_NAME = "egf_fund";
	public static final String SEQUENCE_NAME = "seq_egf_fund";
	public static final String ALIAS = "fund";

	private static final long serialVersionUID = 7977534010758407945L;

	protected String id;

	@Length(max = 50, min = 2)
	@NotNull
	protected String name;

	@Length(max = 50, min = 2)
	@NotNull
	protected String code;
	@NotNull
	protected Character identifier;

	@NotNull
	protected Long level;

	@NotNull
	protected Boolean active;

	protected String parentId;

	public Fund toDomain() {

		Fund fund = new Fund();
		Fund parent = null;
		if (parentId != null) {
			parent = Fund.builder().id(parentId).build();
		}
		super.toDomain(fund);
		fund.setId(this.id);
		fund.setCode(this.code);
		fund.setName(this.name);
		fund.setIdentifier(this.identifier);
		fund.setActive(this.active);
		fund.setParent(parent);
		fund.setLevel(this.level);
		return fund;

	}

	public FundEntity toEntity(Fund fund) {

		super.toEntity(fund);
		this.id = fund.getId();
		this.name = fund.getName();
		this.code = fund.getCode();
		this.identifier = fund.getIdentifier();
		this.level = 1l;
		this.parentId = fund.getParent() != null ? fund.getParent().getId() : null;
		this.active = fund.getActive();
		this.level = fund.getLevel();
		return this;

	}

}
