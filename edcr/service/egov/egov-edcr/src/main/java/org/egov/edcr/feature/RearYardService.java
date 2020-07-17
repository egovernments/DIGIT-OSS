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

import static org.egov.edcr.constants.DxfFileConstants.A;
import static org.egov.edcr.constants.DxfFileConstants.A_AF;
import static org.egov.edcr.constants.DxfFileConstants.A_R;
import static org.egov.edcr.constants.DxfFileConstants.B;
import static org.egov.edcr.constants.DxfFileConstants.D;
import static org.egov.edcr.constants.DxfFileConstants.F;
import static org.egov.edcr.constants.DxfFileConstants.G;
import static org.egov.edcr.constants.DxfFileConstants.I;
import static org.egov.edcr.constants.DxfFileConstants.A_PO;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.REAR_YARD_DESC;
import static org.egov.edcr.utility.DcrConstants.YES;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Building;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Plot;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.common.entity.edcr.SetBack;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.infra.utils.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class RearYardService extends GeneralRule {
	private static final String RULE_35 = "35 Table-8";
	private static final String RULE_36 = "36";
	private static final String RULE_37_TWO_A = "37-2-A";
	private static final String RULE_37_TWO_B = "37-2-B";
	private static final String RULE_37_TWO_C = "37-2-C";
	private static final String RULE_37_TWO_D = "37-2-D";
	private static final String RULE_37_TWO_G = "37-2-G";
	private static final String RULE_37_TWO_H = "37-2-H";
	private static final String RULE_37_TWO_I = "37-2-I";
	private static final String RULE_47 = "47";

	private static final String MINIMUMLABEL = "Minimum distance ";

	private static final BigDecimal REARYARDMINIMUM_DISTANCE_0_9 = BigDecimal.valueOf(0.9);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_1_2 = BigDecimal.valueOf(1.2);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_1_5 = BigDecimal.valueOf(1.5);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_1_8 = BigDecimal.valueOf(1.8);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_2 = BigDecimal.valueOf(2);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_2_5 = BigDecimal.valueOf(2.5);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_3 = BigDecimal.valueOf(3);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_3_6 = BigDecimal.valueOf(3.6);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_4 = BigDecimal.valueOf(4);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_4_5 = BigDecimal.valueOf(4.5);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_5 = BigDecimal.valueOf(5);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_6 = BigDecimal.valueOf(6);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_7 = BigDecimal.valueOf(7);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_8 = BigDecimal.valueOf(8);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_9 = BigDecimal.valueOf(9);
	private static final BigDecimal REARYARDMINIMUM_DISTANCE_12 = BigDecimal.valueOf(12);

	public static final String BSMT_REAR_YARD_DESC = "Basement Rear Setback";
	private static final int PLOTAREA_300 = 300;
	public static final BigDecimal ROAD_WIDTH_TWELVE_POINTTWO = BigDecimal.valueOf(12.2);

	private class RearYardResult {
		String rule;
		String subRule;
		String blockName;
		Integer level;
		BigDecimal actualMeanDistance = BigDecimal.ZERO;
		BigDecimal actualMinDistance = BigDecimal.ZERO;
		String occupancy;
		BigDecimal expectedminimumDistance = BigDecimal.ZERO;
		BigDecimal expectedmeanDistance = BigDecimal.ZERO;
		boolean status = false;
	}

	public void processRearYard(final Plan pl) {
		HashMap<String, String> errors = new HashMap<>();
		final Plot plot = pl.getPlot();
		if (plot == null)
			return;

		validateRearYard(pl);

		if (plot != null && !pl.getBlocks().isEmpty()) {
			for (Block block : pl.getBlocks()) { // for each block

				scrutinyDetail = new ScrutinyDetail();
				scrutinyDetail.addColumnHeading(1, RULE_NO);
				scrutinyDetail.addColumnHeading(2, LEVEL);
				scrutinyDetail.addColumnHeading(3, OCCUPANCY);
				scrutinyDetail.addColumnHeading(4, FIELDVERIFIED);
				scrutinyDetail.addColumnHeading(5, PERMISSIBLE);
				scrutinyDetail.addColumnHeading(6, PROVIDED);
				scrutinyDetail.addColumnHeading(7, STATUS);
				scrutinyDetail.setHeading(REAR_YARD_DESC);
				RearYardResult rearYardResult = new RearYardResult();

				for (SetBack setback : block.getSetBacks()) {
					BigDecimal min;
					BigDecimal mean;

					if (setback.getRearYard() != null
							&& setback.getRearYard().getMean().compareTo(BigDecimal.ZERO) > 0) {
						min = setback.getRearYard().getMinimumDistance();
						mean = setback.getRearYard().getMean();

						// if height defined at rear yard level, then use elase use buidling height.
						BigDecimal buildingHeight = setback.getRearYard().getHeight() != null
								&& setback.getRearYard().getHeight().compareTo(BigDecimal.ZERO) > 0
										? setback.getRearYard().getHeight()
										: block.getBuilding().getBuildingHeight();

						if (buildingHeight != null && (min.doubleValue() > 0 || mean.doubleValue() > 0)) {
							for (final Occupancy occupancy : block.getBuilding().getTotalArea()) {
								scrutinyDetail.setKey("Block_" + block.getName() + "_" + "Rear Setback");

								if (setback.getLevel() < 0) {
									scrutinyDetail.setKey("Block_" + block.getName() + "_" + "Basement Rear Setback");
									checkRearYardBasement(pl, block.getBuilding(), block.getName(), setback.getLevel(),
											plot, BSMT_REAR_YARD_DESC, min, mean, occupancy.getTypeHelper(),
											rearYardResult);

								}
								if ((occupancy.getTypeHelper().getSubtype() != null
										&& (A_R.equalsIgnoreCase(occupancy.getTypeHelper().getSubtype().getCode())
										|| A_AF.equalsIgnoreCase(occupancy.getTypeHelper().getSubtype().getCode())
										|| A_PO.equalsIgnoreCase(occupancy.getTypeHelper().getSubtype().getCode()))
										|| F.equalsIgnoreCase(occupancy.getTypeHelper().getType().getCode()))) {
									if (buildingHeight.compareTo(BigDecimal.valueOf(10)) <= 0 && block.getBuilding()
											.getFloorsAboveGround().compareTo(BigDecimal.valueOf(3)) <= 0) {
										checkRearYardUptoTenMts(pl, block.getBuilding(), block, setback.getLevel(),
												plot, REAR_YARD_DESC, min, mean, occupancy.getTypeHelper(),
												rearYardResult, buildingHeight);

									} else if (buildingHeight.compareTo(BigDecimal.valueOf(12)) <= 0
											&& block.getBuilding().getFloorsAboveGround()
													.compareTo(BigDecimal.valueOf(4)) <= 0) {
										checkRearYardUptoToTweleveMts(setback, block.getBuilding(), pl, block,
												setback.getLevel(), plot, REAR_YARD_DESC, min, mean,
												occupancy.getTypeHelper(), rearYardResult, errors);

									} else if (buildingHeight.compareTo(BigDecimal.valueOf(16)) <= 0) {
										checkRearYardUptoToSixteenMts(setback, block.getBuilding(), pl, block,
												setback.getLevel(), plot, REAR_YARD_DESC, min, mean,
												occupancy.getTypeHelper(), rearYardResult, errors);

									} else if (buildingHeight.compareTo(BigDecimal.valueOf(16)) > 0) {
										checkRearYardAboveSixteenMts(setback, block.getBuilding(), pl, block,
												setback.getLevel(), plot, REAR_YARD_DESC, min, mean,
												occupancy.getTypeHelper(), rearYardResult, buildingHeight);

									}
								} else if (G.equalsIgnoreCase(occupancy.getTypeHelper().getType().getCode())) {
									checkRearYardForIndustrial(setback, block.getBuilding(), pl, block,
											setback.getLevel(), plot, REAR_YARD_DESC, min, mean,
											occupancy.getTypeHelper(), rearYardResult);
								} else {
									checkRearYardOtherOccupancies(setback, block.getBuilding(), pl, block,
											setback.getLevel(), plot, REAR_YARD_DESC, min, mean,
											occupancy.getTypeHelper(), rearYardResult, buildingHeight);
								}

							}
							Map<String, String> details = new HashMap<>();
							details.put(RULE_NO, rearYardResult.subRule);
							details.put(LEVEL, rearYardResult.level != null ? rearYardResult.level.toString() : "");
							details.put(OCCUPANCY, rearYardResult.occupancy);
							if (rearYardResult.expectedmeanDistance != null
									&& rearYardResult.expectedmeanDistance.compareTo(BigDecimal.valueOf(0)) == 0) {
								details.put(FIELDVERIFIED, MINIMUMLABEL);
								details.put(PERMISSIBLE, rearYardResult.expectedminimumDistance.toString());
								details.put(PROVIDED, rearYardResult.actualMinDistance.toString());

							} else {
								details.put(FIELDVERIFIED, MINIMUMLABEL);
								details.put(PERMISSIBLE, rearYardResult.expectedminimumDistance.toString());
								details.put(PROVIDED, rearYardResult.actualMinDistance.toString());
							}
							if (rearYardResult.status) {
								details.put(STATUS, Result.Accepted.getResultVal());

							} else {
								details.put(STATUS, Result.Not_Accepted.getResultVal());
							}
							scrutinyDetail.getDetail().add(details);
							pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

						}
					}
				}
			}
		}

	}

	private Boolean checkRearYardUptoTenMts(final Plan pl, Building building, Block block, Integer level,
			final Plot plot, final String rearYardFieldName, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult,
			BigDecimal buildingHeight) {
		String subRule = RULE_35;
		String rule = REAR_YARD_DESC;
		Boolean valid = false;
		BigDecimal minVal = BigDecimal.valueOf(0);
		BigDecimal meanVal = BigDecimal.valueOf(0);
		BigDecimal depthOfPlot = pl.getPlanInformation().getDepthOfPlot();

		if (mostRestrictiveOccupancy.getSubtype() != null && (A_R.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
				|| A_AF.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
				|| A_PO.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode()))) {
			if (pl.getPlanInformation() != null && pl.getPlanInformation().getRoadWidth() != null
					&& StringUtils.isNotBlank(pl.getPlanInformation().getLandUseZone())
					&& DxfFileConstants.COMMERCIAL.equalsIgnoreCase(pl.getPlanInformation().getLandUseZone())
					&& pl.getPlanInformation().getRoadWidth().compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				valid = commercialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult,
						DxfFileConstants.RULE_28, rule, minVal, meanVal, depthOfPlot, valid);
			} else {
				valid = residentialUptoTenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult,
						subRule, rule, minVal, meanVal, depthOfPlot, valid);
			}

        } else if (F.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
            valid = commercialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult, subRule,
                    rule, minVal, meanVal, depthOfPlot, valid);
        }

		return valid;
	}

	private Boolean residentialUptoTenMts(Block block, Integer level, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult, String subRule,
			String rule, BigDecimal minVal, BigDecimal meanVal, BigDecimal depthOfPlot, Boolean valid) {

		if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_0_9;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(15)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_1_2;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(15)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(21)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_1_5;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(21)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(27)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_1_8;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(27)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(33)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_2_5;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(33)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(39)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_3;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(39)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(45)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(45)) > 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		}

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);
		/*
		 * if (-1 == level) { subRule = SUB_RULE_24_12; rule = BSMT_REAR_YARD_DESC;
		 * subRuleDesc = SUB_RULE_24_12_DESCRIPTION; }
		 */
		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean checkRearYardBasement(Plan plan, Building building, String blockName, Integer level,
			Plot plot, String rearYardFieldName, BigDecimal min, BigDecimal mean,
			OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult) {
		Boolean valid = false;
		String subRule = RULE_47;
		String rule = REAR_YARD_DESC;
		BigDecimal minVal = BigDecimal.ZERO;
		BigDecimal meanVal = BigDecimal.ZERO;
        if ((mostRestrictiveOccupancy.getSubtype() != null
                && A_R.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                || A_AF.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                || A_PO.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode()))
                || F.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			if (plot.getArea().compareTo(BigDecimal.valueOf(PLOTAREA_300)) <= 0) {
				minVal = REARYARDMINIMUM_DISTANCE_3;
				valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);
			}

				rule = BSMT_REAR_YARD_DESC;

			compareRearYardResult(blockName, min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule, rule,
					minVal, meanVal, level);
		}
		return valid;
	}

	private Boolean checkRearYardUptoToTweleveMts(SetBack setback, Building building, final Plan pl, Block block,
			Integer level, final Plot plot, final String rearYardFieldName, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult,
			HashMap<String, String> errors) {
		String subRule = RULE_35;
		String rule = REAR_YARD_DESC;
		Boolean valid = false;
		BigDecimal minVal = BigDecimal.valueOf(0);
		BigDecimal meanVal = BigDecimal.valueOf(0);
		BigDecimal depthOfPlot = pl.getPlanInformation().getDepthOfPlot();

		if (mostRestrictiveOccupancy.getSubtype() != null && A_R.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                || A_AF.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                || A_PO.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())) {
			if (pl.getPlanInformation() != null && pl.getPlanInformation().getRoadWidth() != null
					&& StringUtils.isNotBlank(pl.getPlanInformation().getLandUseZone())
					&& DxfFileConstants.COMMERCIAL.equalsIgnoreCase(pl.getPlanInformation().getLandUseZone())
					&& pl.getPlanInformation().getRoadWidth().compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				commercialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult,
						DxfFileConstants.RULE_28, rule, minVal, meanVal, depthOfPlot, valid);
			} else {
				valid = residentialUptoTwelveMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult,
						subRule, rule, minVal, meanVal, depthOfPlot, valid, errors, pl);
			}

		}else if (F.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
	            valid = commercialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult, subRule,
	                    rule, minVal, meanVal, depthOfPlot, valid);
	        }

		return valid;
	}

	private Boolean checkRearYardForIndustrial(SetBack setback, Building building, final Plan pl, Block block,
			Integer level, final Plot plot, final String rearYardFieldName, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult) {
		String subRule = RULE_35;
		String rule = REAR_YARD_DESC;
		Boolean valid = false;
		BigDecimal minVal = BigDecimal.valueOf(0);
		BigDecimal meanVal = BigDecimal.valueOf(0);
		BigDecimal widthOfPlot = pl.getPlanInformation().getWidthOfPlot();

		valid = processRearYardForIndustrial(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult, subRule,
				rule, minVal, meanVal, pl.getPlot().getArea(), widthOfPlot, valid);

		return valid;
	}

	private Boolean residentialUptoTwelveMts(Block block, Integer level, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult, String subRule,
			String rule, BigDecimal minVal, BigDecimal meanVal, BigDecimal depthOfPlot, Boolean valid,
			HashMap<String, String> errors, Plan pl) {

		if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) <= 0) {
			errors.put("uptoTwelveHeightUptoTenDepthRearYard",
					"No construction shall be permitted if depth of plot is less than 10 and building height less than 12 having floors upto G+2.");
			pl.addErrors(errors);
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(15)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_1_8;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(15)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(21)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_2;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(21)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(27)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_2_5;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(27)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(33)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_3;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(33)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(39)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(39)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(45)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(45)) > 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		}

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);
		/*
		 * if (-1 == level) { subRule = SUB_RULE_24_12; rule = BSMT_REAR_YARD_DESC;
		 * subRuleDesc = SUB_RULE_24_12_DESCRIPTION; }
		 */

		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean processRearYardForIndustrial(Block block, Integer level, final BigDecimal min,
			final BigDecimal mean, final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult,
			String subRule, String rule, BigDecimal minVal, BigDecimal meanVal, BigDecimal plotArea,
			BigDecimal widthOfPlot, Boolean valid) {

		if (plotArea.compareTo(BigDecimal.valueOf(550)) < 0) {
			if (widthOfPlot.compareTo(BigDecimal.valueOf(10)) <= 0) {
				minVal = REARYARDMINIMUM_DISTANCE_3;
			} else if (widthOfPlot.compareTo(BigDecimal.valueOf(12)) <= 0) {
				minVal = REARYARDMINIMUM_DISTANCE_3;
			} else if (widthOfPlot.compareTo(BigDecimal.valueOf(15)) <= 0) {
				minVal = REARYARDMINIMUM_DISTANCE_3;
			} else if (widthOfPlot.compareTo(BigDecimal.valueOf(18)) <= 0) {
				minVal = REARYARDMINIMUM_DISTANCE_4;
			} else if (widthOfPlot.compareTo(BigDecimal.valueOf(18)) > 0) {
				minVal = REARYARDMINIMUM_DISTANCE_4_5;
			}
		} else if (plotArea.compareTo(BigDecimal.valueOf(550)) > 0
				&& plotArea.compareTo(BigDecimal.valueOf(1000)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;

		} else if (plotArea.compareTo(BigDecimal.valueOf(1000)) > 0
				&& plotArea.compareTo(BigDecimal.valueOf(5000)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_6;

		} else if (plotArea.compareTo(BigDecimal.valueOf(5000)) > 0
				&& plotArea.compareTo(BigDecimal.valueOf(30000)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_9;

		} else if (plotArea.compareTo(BigDecimal.valueOf(30000)) > 0) {
			minVal = REARYARDMINIMUM_DISTANCE_12;

		}

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);
		/*
		 * if (-1 == level) { subRule = SUB_RULE_24_12; rule = BSMT_REAR_YARD_DESC;
		 * subRuleDesc = SUB_RULE_24_12_DESCRIPTION; }
		 */

		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean checkRearYardUptoToSixteenMts(SetBack setback, Building building, final Plan pl, Block block,
			Integer level, final Plot plot, final String rearYardFieldName, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult,
			HashMap<String, String> errors) {
		String subRule = RULE_35;
		String rule = REAR_YARD_DESC;
		Boolean valid = false;
		BigDecimal minVal = BigDecimal.valueOf(0);
		BigDecimal meanVal = BigDecimal.valueOf(0);
		BigDecimal depthOfPlot = pl.getPlanInformation().getDepthOfPlot();

        if (A_R.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                || A_AF.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                || A_PO.equalsIgnoreCase(mostRestrictiveOccupancy.getSubtype().getCode())
                        && block.getBuilding().getFloorsAboveGround().compareTo(BigDecimal.valueOf(5)) <= 0) {
			if (pl.getPlanInformation() != null && pl.getPlanInformation().getRoadWidth() != null
					&& StringUtils.isNotBlank(pl.getPlanInformation().getLandUseZone())
					&& DxfFileConstants.COMMERCIAL.equalsIgnoreCase(pl.getPlanInformation().getLandUseZone())
					&& pl.getPlanInformation().getRoadWidth().compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				valid = commercialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult,
						DxfFileConstants.RULE_28, rule, minVal, meanVal, depthOfPlot, valid);
			} else {
				valid = residentialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult,
						subRule, rule, minVal, meanVal, depthOfPlot, valid, errors, pl);
			}
		} else if (F.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			valid = commercialUptoSixteenMts(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult, subRule,
					rule, minVal, meanVal, depthOfPlot, valid);
		}

		return valid;
	}

	private Boolean residentialUptoSixteenMts(Block block, Integer level, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult, String subRule,
			String rule, BigDecimal minVal, BigDecimal meanVal, BigDecimal depthOfPlot, Boolean valid,
			HashMap<String, String> errors, Plan pl) {
		if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) <= 0) {
			errors.put("uptoSixteenHeightUptoTenDepthRearYard",
					"No construction shall be permitted if depth of plot is less than 10 and building height less than 16 having floors upto G+4.");
			pl.addErrors(errors);
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(15)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_2;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(15)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(21)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_3;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(21)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(27)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_3_6;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(27)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(33)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(33)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(39)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(39)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(45)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(45)) > 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;
		}

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);
		/*
		 * if (-1 == level) { subRule = SUB_RULE_24_12; rule = BSMT_REAR_YARD_DESC;
		 * subRuleDesc = SUB_RULE_24_12_DESCRIPTION; }
		 */

		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean commercialUptoSixteenMts(Block block, Integer level, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult, String subRule,
			String rule, BigDecimal minVal, BigDecimal meanVal, BigDecimal depthOfPlot, Boolean valid) {
		if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_2;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(10)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(15)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_3;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(15)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(21)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(21)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(27)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(27)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(33)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(33)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(39)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(39)) > 0
				&& depthOfPlot.compareTo(BigDecimal.valueOf(45)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;
		} else if (depthOfPlot.compareTo(BigDecimal.valueOf(45)) > 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;
		}

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);
		/*
		 * if (-1 == level) { subRule = SUB_RULE_24_12; rule = BSMT_REAR_YARD_DESC;
		 * subRuleDesc = SUB_RULE_24_12_DESCRIPTION; }
		 */

		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean checkRearYardAboveSixteenMts(SetBack setback, Building building, final Plan pl, Block block,
			Integer level, final Plot plot, final String rearYardFieldName, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult,
			BigDecimal buildingHeight) {
		Boolean valid = false;
		String subRule = RULE_36;
		String rule = REAR_YARD_DESC;
		BigDecimal minVal = BigDecimal.ZERO;
		BigDecimal meanVal = BigDecimal.ZERO;
		valid = allOccupancyForHighRise(block, level, min, mean, mostRestrictiveOccupancy, rearYardResult, subRule,
				rule, minVal, meanVal, buildingHeight);
		return valid;
	}

	private Boolean allOccupancyForHighRise(Block block, Integer level, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult, String subRule,
			String rule, BigDecimal minVal, BigDecimal meanVal, BigDecimal blockBuildingHeight) {
		Boolean valid = false;

		if (blockBuildingHeight.compareTo(BigDecimal.valueOf(16)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(19)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(19)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(22)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_4_5;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(22)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(25)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_5;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(25)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(28)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_6;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(28)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(31)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_7;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(31)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(36)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_7;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(36)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(41)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_8;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(41)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(46)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_8;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(46)) > 0
				&& blockBuildingHeight.compareTo(BigDecimal.valueOf(51)) <= 0) {
			minVal = REARYARDMINIMUM_DISTANCE_9;
		} else if (blockBuildingHeight.compareTo(BigDecimal.valueOf(51)) > 0) {
			minVal = REARYARDMINIMUM_DISTANCE_9;
		}

		/*
		 * if (-1 == level) { rule = BSMT_REAR_YARD_DESC; subRuleDesc =
		 * SUB_RULE_24_12_DESCRIPTION; subRule = SUB_RULE_24_12; }
		 */

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);

		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean checkRearYardOtherOccupancies(SetBack setback, Building building, final Plan pl, Block block,
			Integer level, final Plot plot, final String rearYardFieldName, final BigDecimal min, final BigDecimal mean,
			final OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult,
			BigDecimal buildingHeight) {
		Boolean valid = false;
		String subRule = RULE_37_TWO_A;
		String rule = REAR_YARD_DESC;
		BigDecimal minVal = BigDecimal.ZERO;
		BigDecimal meanVal = BigDecimal.ZERO;
		// Educational
		if (mostRestrictiveOccupancy.getType() != null && B.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			minVal = REARYARDMINIMUM_DISTANCE_6;
			subRule = RULE_37_TWO_A;
		} // Institutional
		if (mostRestrictiveOccupancy.getType() != null && B.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			minVal = REARYARDMINIMUM_DISTANCE_6;
			subRule = RULE_37_TWO_B;
		} // Assembly
		if (mostRestrictiveOccupancy.getType() != null && D.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			minVal = REARYARDMINIMUM_DISTANCE_6;
			subRule = RULE_37_TWO_C;
		} // Malls and multiplex
		if (mostRestrictiveOccupancy.getType() != null && D.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			minVal = REARYARDMINIMUM_DISTANCE_7;
			subRule = RULE_37_TWO_D;
		} // Hazardous
		if (mostRestrictiveOccupancy.getType() != null && I.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			minVal = REARYARDMINIMUM_DISTANCE_9;
			subRule = RULE_37_TWO_G;
		} // Affordable
		if (mostRestrictiveOccupancy.getType() != null && A.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			minVal = REARYARDMINIMUM_DISTANCE_3;
			subRule = RULE_37_TWO_H;
		}
		// IT,ITES
		if (mostRestrictiveOccupancy.getType() != null && F.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
			// nil as per commercial
			subRule = RULE_37_TWO_I;
		}

		valid = validateMinimumAndMeanValue(min, mean, minVal, meanVal);

		compareRearYardResult(block.getName(), min, mean, mostRestrictiveOccupancy, rearYardResult, valid, subRule,
				rule, minVal, meanVal, level);
		return valid;
	}

	private Boolean validateMinimumAndMeanValue(final BigDecimal min, final BigDecimal mean, final BigDecimal minval,
			final BigDecimal meanval) {
		Boolean valid = false;
		if (min.compareTo(minval) >= 0 && mean.compareTo(meanval) >= 0)
			valid = true;
		return valid;
	}

	private void validateRearYard(final Plan pl) {
		for (Block block : pl.getBlocks()) {
			if (!block.getCompletelyExisting()) {
				Boolean rearYardDefined = false;
				for (SetBack setback : block.getSetBacks()) {
					if (setback.getRearYard() != null
							&& setback.getRearYard().getMean().compareTo(BigDecimal.valueOf(0)) > 0) {
						rearYardDefined = true;
					}
				}
				if (!rearYardDefined && !pl.getPlanInformation().getNocToAbutRearDesc().equalsIgnoreCase(YES)) {
					HashMap<String, String> errors = new HashMap<>();
					errors.put(REAR_YARD_DESC,
							prepareMessage(OBJECTNOTDEFINED, REAR_YARD_DESC + " for Block " + block.getName()));
					pl.addErrors(errors);
				}
			}

		}

	}

	private void compareRearYardResult(String blockName, BigDecimal min, BigDecimal mean,
			OccupancyTypeHelper mostRestrictiveOccupancy, RearYardResult rearYardResult, Boolean valid, String subRule,
			String rule, BigDecimal minVal, BigDecimal meanVal, Integer level) {
		String occupancyName;
		if (mostRestrictiveOccupancy.getSubtype() != null)
			occupancyName = mostRestrictiveOccupancy.getSubtype().getName();
		else
			occupancyName = mostRestrictiveOccupancy.getType().getName();
		if (minVal.compareTo(rearYardResult.expectedminimumDistance) >= 0) {
			if (minVal.compareTo(rearYardResult.expectedminimumDistance) == 0) {
				rearYardResult.rule = rearYardResult.rule != null ? rearYardResult.rule + "," + rule : rule;
				rearYardResult.occupancy = rearYardResult.occupancy != null
						? rearYardResult.occupancy + "," + occupancyName
						: occupancyName;

				if (meanVal.compareTo(rearYardResult.expectedmeanDistance) >= 0) {
					rearYardResult.expectedmeanDistance = meanVal;
					rearYardResult.actualMeanDistance = mean;
				}
			} else {
				rearYardResult.rule = rule;
				rearYardResult.occupancy = occupancyName;
				rearYardResult.expectedmeanDistance = meanVal;
				rearYardResult.actualMeanDistance = mean;

			}

			rearYardResult.subRule = subRule;
			rearYardResult.blockName = blockName;
			rearYardResult.level = level;
			rearYardResult.expectedminimumDistance = minVal;
			rearYardResult.actualMinDistance = min;
			rearYardResult.status = valid;

		}
	}
}
