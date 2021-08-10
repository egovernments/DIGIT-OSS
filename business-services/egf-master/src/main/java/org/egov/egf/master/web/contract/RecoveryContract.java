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

package org.egov.egf.master.web.contract;

import lombok.*;
import org.egov.common.web.contract.AuditableContract;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RecoveryContract extends AuditableContract {

	private static final long serialVersionUID = 7977534010758407945L;

	protected String id;

	@Length(max = 50, min = 2)
	@NotNull
	protected String name;

	@Length(max = 50, min = 2)
	@NotNull
	protected String code;

	@NotNull
	protected ChartOfAccountContract chartOfAccount;

	protected String type;

	protected Double flat;

	protected Double percentage;

	@NotNull
	protected Boolean active;

	@Length(max = 100)
	protected String remitted;

	@Length(max = 16)
	protected String ifscCode;

	protected Character mode;

	protected Character remittanceMode;

	@Length(max = 32)
	protected String accountNumber;

	public RecoveryContract(String id) {
		this.id = id;
	}
}
