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
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Circle;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.Util;
import org.springframework.stereotype.Service;

@Service
public class SpiralStair extends FeatureProcess {
	private static final Logger LOG = LogManager.getLogger(SpiralStair.class);
	private static final String FLOOR = "Floor";
	private static final String EXPECTED_DIAMETER = "1.50";
	private static final String RULE42_5_IV = "42-5-iv";
	private static final String DIAMETER_DESCRIPTION = "Minimum diameter for spiral fire stair %s";

	@Override
	public Plan process(Plan plan) {
		blk: for (Block block : plan.getBlocks()) {
			if (block.getBuilding() != null && !block.getBuilding().getOccupancies().isEmpty()) {
				/*
				 * if (Util.checkExemptionConditionForBuildingParts(block) ||
				 * Util.checkExemptionConditionForSmallPlotAtBlkLevel(planDetail.getPlot(),
				 * block)) { continue blk; }
				 */

				ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
				scrutinyDetail.addColumnHeading(1, RULE_NO);
				scrutinyDetail.addColumnHeading(2, FLOOR);
				scrutinyDetail.addColumnHeading(3, DESCRIPTION);
				scrutinyDetail.addColumnHeading(4, REQUIRED);
				scrutinyDetail.addColumnHeading(5, PERMISSIBLE);
				scrutinyDetail.addColumnHeading(6, STATUS);
				scrutinyDetail.setKey("Block_" + block.getNumber() + "_" + "Spiral Fire Stair");

				List<Floor> floors = block.getBuilding().getFloors();

				for (Floor floor : floors) {

					boolean isTypicalRepititiveFloor = false;
					Map<String, Object> typicalFloorValues = Util.getTypicalFloorValues(block, floor,
							isTypicalRepititiveFloor);

					List<org.egov.common.entity.edcr.SpiralStair> spiralStairs = floor.getSpiralStairs();

					if (spiralStairs.size() != 0) {
						boolean valid = false;

						for (org.egov.common.entity.edcr.SpiralStair spiralStair : spiralStairs) {
							List<Circle> spiralPolyLines = spiralStair.getCircles();

							if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) {
								if (Util.roundOffTwoDecimal(block.getBuilding().getBuildingHeight())
										.compareTo(Util.roundOffTwoDecimal(BigDecimal.valueOf(10))) > 0
										&& !spiralPolyLines.isEmpty()) {
									valid = true;
								}
								String value = typicalFloorValues.get("typicalFloors") != null
										? (String) typicalFloorValues.get("typicalFloors")
										: " floor " + floor.getNumber();

								if (valid) {
									setReportOutputDetailsFloorStairWise(plan, RULE42_5_IV, value,
											spiralStair.getNumber(), "",
											"spiral stair of fire stair not allowed for building with height > 9 for block "
													+ block.getNumber() + " " + value,
											Result.Not_Accepted.getResultVal(), scrutinyDetail);
								} else {

									if (!spiralPolyLines.isEmpty()) {
										Circle minSpiralStair = spiralPolyLines.stream()
												.min(Comparator.comparing(Circle::getRadius)).get();

										BigDecimal minRadius = minSpiralStair.getRadius();

										BigDecimal radius = Util.roundOffTwoDecimal(minRadius);
										BigDecimal diameter = Util.roundOffTwoDecimal(
												radius.multiply(Util.roundOffTwoDecimal(BigDecimal.valueOf(2))));
										BigDecimal minDiameter = Util.roundOffTwoDecimal(BigDecimal.valueOf(1.50));

										if (diameter.compareTo(minDiameter) >= 0) {
											setReportOutputDetailsFloorStairWise(plan, RULE42_5_IV, value,
													String.format(DIAMETER_DESCRIPTION, spiralStair.getNumber()),
													EXPECTED_DIAMETER, String.valueOf(diameter),
													Result.Accepted.getResultVal(), scrutinyDetail);
										} else {
											setReportOutputDetailsFloorStairWise(plan, RULE42_5_IV, value,
													String.format(DIAMETER_DESCRIPTION, spiralStair.getNumber()),
													EXPECTED_DIAMETER, String.valueOf(diameter),
													Result.Not_Accepted.getResultVal(), scrutinyDetail);
										}
									}
								}

							}
						}
					}
				}
			}
		}
		return plan;
	}

	private void setReportOutputDetailsFloorStairWise(Plan pl, String ruleNo, String floor, String description,
			String expected, String actual, String status, ScrutinyDetail scrutinyDetail) {
		Map<String, String> details = new HashMap<>();
		details.put(RULE_NO, ruleNo);
		details.put(FLOOR, floor);
		details.put(DESCRIPTION, description);
		details.put(REQUIRED, expected);
		details.put(PERMISSIBLE, actual);
		details.put(STATUS, status);
		scrutinyDetail.getDetail().add(details);
		pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
	}

	@Override
	public Plan validate(Plan pl) {
		return pl;
	}

	@Override
	public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
	}

}
