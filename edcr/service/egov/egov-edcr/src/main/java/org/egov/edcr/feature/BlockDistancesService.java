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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.BlockDistances;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.common.entity.edcr.SetBack;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.utils.StringUtils;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class BlockDistancesService extends FeatureProcess {
	public static final String SUBRULE_54_3 = "54-3";
	public static final String SUBRULE_55_2 = "55-2";
	public static final String SUBRULE_57_4 = "57-4";
	public static final String SUBRULE_58_3_A = "58-3-a";
	public static final String SUBRULE_59_3 = "59-3";
	public static final String SUBRULE_117_3 = "117-3";
	public static final BigDecimal DIS_7_5 = BigDecimal.valueOf(7.5);
	public static final String BLK_NUMBER = "blkNumber";
	public static final String SUBRULE = "subrule";
	public static final String MIN_DISTANCE = "minimumDistance";
	public static final String OCCUPANCY = "occupancy";
	private static final String SUBRULE_37_1 = "37-1";
	private static final String SUB_RULE_DES = "Minimum distance between blocks %s and %s";
	public static final String MINIMUM_DISTANCE_SETBACK = "Minimum distance should not be less than setback of tallest building or 3m";
	public static final String MINIMUM_DISTANCE_BUILDING = "Minimum distance should not be less than 1/3 of height of tallest building or 18m";
	private static final BigDecimal THREE = BigDecimal.valueOf(3);

	@Override
	public Plan validate(Plan pl) {
		return pl;
	}

	@Override
	public Plan process(Plan pl) {
		processDistanceBetweenBlocks(pl);
		return pl;
	}

	public void validateDistanceBetweenBlocks(Plan pl) {
		HashMap<String, String> errors = new HashMap<>();
		List<String> sourceBlockNumbers = new ArrayList<>();
		// iterating blocks one by one
		for (Block sourceBlock : pl.getBlocks()) {
			// validation for building height and occupancies present in diagram or not
			if (sourceBlock.getBuilding() != null) {
				if (sourceBlock.getBuilding().getBuildingHeight().compareTo(BigDecimal.ZERO) == 0) {
					errors.put(String.format(DcrConstants.BLOCK_BUILDING_HEIGHT, sourceBlock.getNumber()),
							edcrMessageSource.getMessage(
									DcrConstants.OBJECTNOTDEFINED, new String[] { String
											.format(DcrConstants.BLOCK_BUILDING_HEIGHT, sourceBlock.getNumber()) },
									LocaleContextHolder.getLocale()));
					pl.addErrors(errors);
				}
				if (sourceBlock.getBuilding().getOccupancies().isEmpty()) {
					errors.put(String.format(DcrConstants.BLOCK_BUILDING_OCCUPANCY, sourceBlock.getNumber()),
							edcrMessageSource.getMessage(
									DcrConstants.OBJECTNOTDEFINED, new String[] { String
											.format(DcrConstants.BLOCK_BUILDING_OCCUPANCY, sourceBlock.getNumber()) },
									LocaleContextHolder.getLocale()));
					pl.addErrors(errors);
				}
			}
			// eg if i have three blocks b1 , b2 ,b3 in first iteration and b1 is source,
			// b1-> b1 is not validated as b1 is
			// present in list sourceBlockNumbers.
			// b1->b2 is validated and b2 -> b1 is validated.if no one is present error
			// message is thrown.
			// b1->b3 is validated and b3 -> b1 is validated .if no one is present error
			// message is thrown.
			// in second iteration, when b2 is source b2-> b2 is not validated as b2 is
			// present in list sourceBlockNumbers.
			// b2-> b1 is not validated as b2 is present in list sourceBlockNumbers.
			// b2->b3 is validated and b3 -> b2 is validated .if no one is present error
			// message is thrown.
			// in third iteration , when b3 is source b3->b3,b3->b1,b3->b2 all are not
			// validated as b1,b2,b3 all are present in
			// list sourceBlockNumbers.
			sourceBlockNumbers.add(sourceBlock.getNumber());
			for (Block destinationBlock : pl.getBlocks()) {
				if (!sourceBlockNumbers.contains(destinationBlock.getNumber())) {
					// distance from source to destination block present or not
					List<BigDecimal> distanceBetBlocks = new ArrayList<>();
					List<BigDecimal> distanceBtwBlocks = new ArrayList<>();
					if (!sourceBlock.getDistanceBetweenBlocks().isEmpty()) {
						for (BlockDistances distanceBetweenBlock : sourceBlock.getDistanceBetweenBlocks()) {
							if (distanceBetweenBlock.getBlockNumber().equals(destinationBlock.getNumber())) {
								distanceBetBlocks = distanceBetweenBlock.getDistances();
							}
						}
					}
					// distance from destination to source block present or not
					if (!destinationBlock.getDistanceBetweenBlocks().isEmpty()) {
						for (BlockDistances distanceBetweenBlock : destinationBlock.getDistanceBetweenBlocks()) {
							if (distanceBetweenBlock.getBlockNumber().equals(sourceBlock.getNumber())) {
								distanceBtwBlocks = distanceBetweenBlock.getDistances();
							}
						}
					}
					// throw error if no distance is found from source to destination and
					// destination to source blocks
					if (distanceBetBlocks.isEmpty() && distanceBtwBlocks.isEmpty()) {
						errors.put(
								String.format(DcrConstants.BLOCKS_DISTANCE, sourceBlock.getNumber(),
										destinationBlock.getNumber()),
								edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
										new String[] { String.format(DcrConstants.BLOCKS_DISTANCE,
												sourceBlock.getNumber(), destinationBlock.getNumber()) },
										LocaleContextHolder.getLocale()));
						pl.addErrors(errors);

					}
				}
			}
		}
	}

	public void processDistanceBetweenBlocks(Plan pl) {
		if (pl.getBlocks().isEmpty())
			return;
		validateDistanceBetweenBlocks(pl);
		scrutinyDetail = new ScrutinyDetail();
		scrutinyDetail.setKey("Common_Distance Between Blocks");
		scrutinyDetail.addColumnHeading(1, RULE_NO);
		scrutinyDetail.addColumnHeading(2, DESCRIPTION);
		scrutinyDetail.addColumnHeading(3, REQUIRED);
		scrutinyDetail.addColumnHeading(4, PROVIDED);
		scrutinyDetail.addColumnHeading(5, STATUS);
		for (Block b : pl.getBlocks()) {
			for (Block block : pl.getBlocks()) {
				if (b.getNumber() != block.getNumber()) {
					if (!b.getDistanceBetweenBlocks().isEmpty()) {
						for (BlockDistances distanceBetweenBlock : b.getDistanceBetweenBlocks()) {
							// if b is source block , checking that its destination block number is same as
							// block
							if (distanceBetweenBlock.getBlockNumber().equals(block.getNumber())) {
								BigDecimal minimumDistance;
								boolean valid1 = false;
								boolean valid2 = false;
								// calculate minimum of provided distances between source and destination
								if (!distanceBetweenBlock.getDistances().isEmpty()) {
									minimumDistance = distanceBetweenBlock.getDistances().get(0);
									for (BigDecimal distance : distanceBetweenBlock.getDistances()) {
										if (distance.compareTo(minimumDistance) < 0) {
											minimumDistance = distance;
										}
									}
									validateMinimumDistance(pl, minimumDistance, b, block, valid1, valid2);
								}
							}

						}
					}
				}
			}
		}
	}

	/*
	 * private String removeDuplicates(SortedSet<String> uniqueData) { StringBuffer
	 * str = new StringBuffer(); List<String> unqList = new ArrayList<>(uniqueData);
	 * for (String unique : unqList) { str.append(unique); if
	 * (!unique.equals(unqList.get(unqList.size() - 1))) { str.append(" , "); } }
	 * return str.toString(); }
	 */

	private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String occupancy, String expected,
			String actual, String status) {
		Map<String, String> details = new HashMap<>();
		details.put(RULE_NO, ruleNo);
		details.put(DESCRIPTION, ruleDesc);
		details.put(REQUIRED, expected);
		details.put(PROVIDED, actual);
		details.put(STATUS, status);
		scrutinyDetail.getDetail().add(details);
		pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
	}

	/*
	 * private boolean getHeightGreaterThanTenAndLessThanSixteenCondition(Block
	 * block) { return
	 * block.getBuilding().getBuildingHeight().compareTo(BigDecimal.valueOf(10)) > 0
	 * && block.getBuilding().getBuildingHeight().compareTo(BigDecimal.valueOf(16))
	 * < 0; }
	 * 
	 * private boolean getHeightLessThanTenCondition(Block block) { return
	 * block.getBuilding().getBuildingHeight().compareTo(BigDecimal.valueOf(10)) <=
	 * 0; }
	 */

	private void validateMinimumDistance(Plan pl, BigDecimal actualDistance, Block b, Block block, Boolean valid1,
			Boolean valid2) {
		BigDecimal bHeight = b.getBuilding().getBuildingHeight();
		BigDecimal blockHeight = block.getBuilding().getBuildingHeight();
		HashMap<BigDecimal, Block> blockMap = new HashMap();
		blockMap.put(bHeight, b);
		blockMap.put(blockHeight, block);
		List<BigDecimal> blkHeights = Arrays.asList(bHeight, blockHeight);
		BigDecimal maxHeight = blkHeights.stream().reduce(BigDecimal::max).get();

		ArrayList<BigDecimal> setBacksValues = new ArrayList();
		setBacksValues.add(THREE);
		List<SetBack> setBacks = block.getSetBacks();
		for (SetBack setback : setBacks) {
			if (setback.getRearYard() != null)
				setBacksValues.add(setback.getRearYard().getHeight());
			if (setback.getSideYard1() != null)
				setBacksValues.add(setback.getSideYard1().getHeight());
			if (setback.getSideYard2() != null)
				setBacksValues.add(setback.getSideYard2().getHeight());
		}
		

		BigDecimal dividedHeight = maxHeight.divide(THREE, DcrConstants.DECIMALDIGITS_MEASUREMENTS,
				DcrConstants.ROUNDMODE_MEASUREMENTS);

		
		List<BigDecimal> heights = Arrays.asList(dividedHeight, BigDecimal.valueOf(18));
		BigDecimal minHeight = heights.stream().reduce(BigDecimal::min).get();

		if (actualDistance.compareTo(minHeight) >= 0) {
			valid1 = true;
		}

		BigDecimal maxSetBack = setBacksValues.stream().reduce(BigDecimal::max).get();
		if (actualDistance.compareTo(maxSetBack) >= 0) {
			valid2 = true;
		}

		if (valid1) {
			setReportOutputDetails(pl, SUBRULE_37_1, String.format(SUB_RULE_DES, b.getNumber(), block.getNumber()),
					StringUtils.EMPTY, MINIMUM_DISTANCE_BUILDING, actualDistance.toString() + DcrConstants.IN_METER,
					Result.Accepted.getResultVal());
		} else {
			setReportOutputDetails(pl, SUBRULE_37_1, String.format(SUB_RULE_DES, b.getNumber(), block.getNumber()),
					StringUtils.EMPTY, MINIMUM_DISTANCE_BUILDING, actualDistance.toString() + DcrConstants.IN_METER,
					Result.Not_Accepted.getResultVal());
		}

		if (valid2) {
			setReportOutputDetails(pl, SUBRULE_37_1, String.format(SUB_RULE_DES, b.getNumber(), block.getNumber()),
					StringUtils.EMPTY, MINIMUM_DISTANCE_SETBACK, actualDistance.toString() + DcrConstants.IN_METER,
					Result.Accepted.getResultVal());
		} else {
			setReportOutputDetails(pl, SUBRULE_37_1, String.format(SUB_RULE_DES, b.getNumber(), block.getNumber()),
					StringUtils.EMPTY, MINIMUM_DISTANCE_SETBACK, actualDistance.toString() + DcrConstants.IN_METER,
					Result.Not_Accepted.getResultVal());
		}

	}

	@Override
	public Map<String, Date> getAmendments() {
		return new LinkedHashMap<>();
	}
}
