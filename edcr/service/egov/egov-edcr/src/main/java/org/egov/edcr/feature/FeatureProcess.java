/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2019>  eGovernments Foundation
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
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
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

package org.egov.edcr.feature;

import java.util.Date;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

public abstract class FeatureProcess {

	protected ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
	public static final String STATUS = "Status";
	public static final String PROVIDED = "Provided";
	public static final String LEVEL = "Level";
	public static final String OCCUPANCY = "Occupancy";
	public static final String FIELDVERIFIED = "Field Verified";
	public static final String REQUIRED = "Required";
	public static final String PERMITTED = "Permitted";
	public static final String PERMISSIBLE = "Permissible";
	public static final String DESCRIPTION = "Description";
	public static final String RULE_NO = "Byelaw";
	public static final String DISTANCE = "Distance";
	public static final String VERIFIED = "Verified";
	public static final String ACTION = "Action";
	public static final String AREA_TYPE = "Area Type";
	public static final String ROAD_WIDTH = "Road Width";

	public abstract Map<String, Date> getAmendments();

	public abstract Plan validate(Plan pl);

	public abstract Plan process(Plan pl);

	@Autowired
	@Qualifier("parentMessageSource")
	protected MessageSource edcrMessageSource;

	public MessageSource getEdcrMessageSource() {
		return edcrMessageSource;
	}

	public void setEdcrMessageSource(MessageSource edcrMessageSource) {
		this.edcrMessageSource = edcrMessageSource;
	}

	public String getLocaleMessage(String code, String... args) {
		return edcrMessageSource.getMessage(code, args, LocaleContextHolder.getLocale());

	}

	public String getAmendmentsRefNumber(Date applicationDate) {
		String refNumber = "";
		Map<String, Date> amendments = getAmendments();
		for (String key : amendments.keySet()) {
			if (applicationDate != null && applicationDate.compareTo(amendments.get(key)) >= 0) {
				refNumber = key;
			}
		}

		return refNumber;
	}

}
