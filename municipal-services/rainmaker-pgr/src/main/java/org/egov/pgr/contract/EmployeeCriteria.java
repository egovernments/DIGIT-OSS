/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.pgr.contract;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class EmployeeCriteria implements Cloneable {

	private List<Long> id;

	@Size(min=1, max=256)
	private String code;
	
        private String codes;

	@DateTimeFormat(pattern = "dd/MM/yyyy")
	private Date asOnDate;

	private Boolean isPrimary;

	private Long designationId;
	
	private Long departmentId;

	private Set<Long> departments;
	
	private List<String> departmentCode;
	
	private Long positionId;

	private List<Long> employeeStatus;

	private List<Long> employeeType;

	private Boolean familyParticularsPresent;

	private Boolean active;

	private String userName;

	private List<String> roleCodes;

	private List<String> sort = Collections.singletonList("name");

	private String sortBy;

	private String sortOrder;

	@NotNull
	@Size(min=1, max=256)
	private String tenantId;

	@Min(1)
	@Max(500)
	private Integer pageSize;

	private Integer pageNumber;

	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
}