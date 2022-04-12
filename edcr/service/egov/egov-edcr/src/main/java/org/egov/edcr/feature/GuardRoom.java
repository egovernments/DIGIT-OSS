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

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.stereotype.Service;

@Service
public class GuardRoom extends FeatureProcess {

	private static final Logger LOGGER = LogManager.getLogger(Parking.class);
	private static final String RULE_48_A = "48-A";
	public static final String GUARD_ROOM_DIMENSION_DESCRIPTION = "Guard Room Dimension";
	public static final String GUARD_ROOM_AREA_DESCRIPTION = "Guard Room Area";
	public static final String GUARD_ROOM_HEIGHT_DESCRIPTION = "Guard Room Height";

	@Override
	public Plan validate(Plan pl) {
		return null;
	}

	@Override
	public Plan process(Plan pl) {
		validate(pl);
		scrutinyDetail = new ScrutinyDetail();
		scrutinyDetail.setKey("Common_Guard Room");
		scrutinyDetail.addColumnHeading(1, RULE_NO);
		scrutinyDetail.addColumnHeading(2, DESCRIPTION);
		scrutinyDetail.addColumnHeading(3, REQUIRED);
		scrutinyDetail.addColumnHeading(4, PROVIDED);
		scrutinyDetail.addColumnHeading(5, STATUS);
		Map<String, String> details = new HashMap<>();
		HashMap<String, String> errors = new HashMap<>();
		BigDecimal minHeight = BigDecimal.ZERO;
		BigDecimal minWidth = BigDecimal.ZERO;
		BigDecimal minArea = BigDecimal.ZERO;
		BigDecimal minCabinHeight = BigDecimal.ZERO;

		if (pl.getGuardRoom() != null && !pl.getGuardRoom().getGuardRooms().isEmpty()) {

			List<BigDecimal> heightList = pl.getGuardRoom().getGuardRooms().stream().map(Measurement::getHeight)
					.collect(Collectors.toList());
			List<BigDecimal> widthList = pl.getGuardRoom().getGuardRooms().stream().map(Measurement::getWidth)
					.collect(Collectors.toList());
			List<BigDecimal> atreaList = pl.getGuardRoom().getGuardRooms().stream().map(Measurement::getArea)
					.collect(Collectors.toList());

			List<BigDecimal> cabinHeightList = pl.getGuardRoom().getCabinHeights();

			if (cabinHeightList != null && !cabinHeightList.isEmpty()) {

				minHeight = heightList.stream().reduce(BigDecimal::min).get();
				minWidth = widthList.stream().reduce(BigDecimal::min).get();
				minArea = atreaList.stream().reduce(BigDecimal::min).get();
				minCabinHeight = cabinHeightList.stream().reduce(BigDecimal::min).get();

				if (minHeight.compareTo(new BigDecimal("4")) >= 0 && minWidth.compareTo(new BigDecimal("3")) >= 0) {
					details.put(RULE_NO, RULE_48_A);
					details.put(DESCRIPTION, GUARD_ROOM_DIMENSION_DESCRIPTION);
					details.put(REQUIRED, "Dimension > 3x4");
					details.put(PROVIDED, "Dimension: " + minWidth + "x" + minHeight);
					details.put(STATUS, Result.Accepted.getResultVal());
					scrutinyDetail.getDetail().add(details);

				} else {
					details = new HashMap<>();
					details.put(RULE_NO, RULE_48_A);
					details.put(DESCRIPTION, GUARD_ROOM_DIMENSION_DESCRIPTION);
					details.put(REQUIRED, "Dimension > 3x4");
					details.put(PROVIDED, "Dimension: " + minWidth + "x" + minHeight);
					details.put(STATUS, Result.Not_Accepted.getResultVal());
					scrutinyDetail.getDetail().add(details);
				}

				if (minArea.compareTo(new BigDecimal("10")) <= 0) {
					details = new HashMap<>();
					details.put(RULE_NO, RULE_48_A);
					details.put(DESCRIPTION, GUARD_ROOM_AREA_DESCRIPTION);
					details.put(REQUIRED, "Area < = 10");
					details.put(PROVIDED, "Area: " + minArea);
					details.put(STATUS, Result.Accepted.getResultVal());
					scrutinyDetail.getDetail().add(details);
				} else {
					details = new HashMap<>();
					details.put(RULE_NO, RULE_48_A);
					details.put(DESCRIPTION, GUARD_ROOM_AREA_DESCRIPTION);
					details.put(REQUIRED, "Area < = 10");
					details.put(PROVIDED, "Area: " + minArea);
					details.put(STATUS, Result.Not_Accepted.getResultVal());
					scrutinyDetail.getDetail().add(details);
				}

				if (minCabinHeight.compareTo(new BigDecimal("0.75")) >= 0
						&& minCabinHeight.compareTo(new BigDecimal("2.2")) <= 0) {
					details = new HashMap<>();
					details.put(RULE_NO, RULE_48_A);
					details.put(DESCRIPTION, GUARD_ROOM_HEIGHT_DESCRIPTION);
					details.put(REQUIRED, "Height >= 0.75m and <= 2.2m");
					details.put(PROVIDED, "Height: " + minCabinHeight + "m");
					details.put(STATUS, Result.Accepted.getResultVal());
					scrutinyDetail.getDetail().add(details);
				} else {
					details = new HashMap<>();
					details.put(RULE_NO, RULE_48_A);
					details.put(DESCRIPTION, GUARD_ROOM_HEIGHT_DESCRIPTION);
					details.put(REQUIRED, "Height >= 0.75m and <= 2.2m");
					details.put(PROVIDED, "Height: " + minCabinHeight + "m");
					details.put(STATUS, Result.Not_Accepted.getResultVal());
					scrutinyDetail.getDetail().add(details);
				}
				pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
			} else {
				errors.put("Distance_Guard Room", "Cabin heights is not provided in layer GUARD_ROOM");
				pl.addErrors(errors);
			}
		}
		return pl;
	}

	@Override
	public Map<String, Date> getAmendments() {
		return new LinkedHashMap<>();
	}
}
