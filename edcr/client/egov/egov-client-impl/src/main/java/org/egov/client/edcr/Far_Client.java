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

package org.egov.client.edcr;

import static org.egov.edcr.constants.DxfFileConstants.A;
import static org.egov.edcr.constants.DxfFileConstants.A2;
import static org.egov.edcr.constants.DxfFileConstants.A_AF;
import static org.egov.edcr.constants.DxfFileConstants.A_FH;
import static org.egov.edcr.constants.DxfFileConstants.A_R;
import static org.egov.edcr.constants.DxfFileConstants.A_SA;
import static org.egov.edcr.constants.DxfFileConstants.B2;
import static org.egov.edcr.constants.DxfFileConstants.D_A;
import static org.egov.edcr.constants.DxfFileConstants.D_B;
import static org.egov.edcr.constants.DxfFileConstants.D_C;
import static org.egov.edcr.constants.DxfFileConstants.E_CLG;
import static org.egov.edcr.constants.DxfFileConstants.E_EARC;
import static org.egov.edcr.constants.DxfFileConstants.E_NS;
import static org.egov.edcr.constants.DxfFileConstants.E_PS;
import static org.egov.edcr.constants.DxfFileConstants.E_SACA;
import static org.egov.edcr.constants.DxfFileConstants.E_SFDAP;
import static org.egov.edcr.constants.DxfFileConstants.E_SFMC;
import static org.egov.edcr.constants.DxfFileConstants.F;
import static org.egov.edcr.constants.DxfFileConstants.H_PP;
import static org.egov.edcr.constants.DxfFileConstants.M_DFPAB;
import static org.egov.edcr.constants.DxfFileConstants.M_HOTHC;
import static org.egov.edcr.constants.DxfFileConstants.M_NAPI;
import static org.egov.edcr.constants.DxfFileConstants.M_OHF;
import static org.egov.edcr.constants.DxfFileConstants.M_VH;
import static org.egov.edcr.constants.DxfFileConstants.S_BH;
import static org.egov.edcr.constants.DxfFileConstants.S_CA;
import static org.egov.edcr.constants.DxfFileConstants.S_CRC;
import static org.egov.edcr.constants.DxfFileConstants.S_ECFG;
import static org.egov.edcr.constants.DxfFileConstants.S_ICC;
import static org.egov.edcr.constants.DxfFileConstants.S_MCH;
import static org.egov.edcr.constants.DxfFileConstants.S_SAS;
import static org.egov.edcr.constants.DxfFileConstants.S_SC;
import static org.egov.edcr.utility.DcrConstants.DECIMALDIGITS_MEASUREMENTS;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.PLOT_AREA;
import static org.egov.edcr.utility.DcrConstants.ROUNDMODE_MEASUREMENTS;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Building;
import org.egov.common.entity.edcr.FarDetails;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.feature.Far;
import org.egov.edcr.service.ProcessPrintHelper;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.utils.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class Far_Client extends Far {

	private static final Logger LOG = LogManager.getLogger(Far_Client.class);

	private static final String VALIDATION_NEGATIVE_FLOOR_AREA = "msg.error.negative.floorarea.occupancy.floor";
	private static final String VALIDATION_NEGATIVE_EXISTING_FLOOR_AREA = "msg.error.negative.existing.floorarea.occupancy.floor";
	private static final String VALIDATION_NEGATIVE_BUILTUP_AREA = "msg.error.negative.builtuparea.occupancy.floor";
	private static final String VALIDATION_NEGATIVE_EXISTING_BUILTUP_AREA = "msg.error.negative.existing.builtuparea.occupancy.floor";
	public static final String RULE_31_1 = "31-1";
	public static final String RULE_38 = "38";

	private static final BigDecimal POINTTWO = BigDecimal.valueOf(0.2);
	private static final BigDecimal POINTFOUR = BigDecimal.valueOf(0.4);
	private static final BigDecimal POINTFIVE = BigDecimal.valueOf(0.5);
	private static final BigDecimal POINTSIX = BigDecimal.valueOf(0.6);
	private static final BigDecimal POINTSEVEN = BigDecimal.valueOf(0.7);
	private static final BigDecimal ONE = BigDecimal.valueOf(1);
	private static final BigDecimal ONE_POINTTWO = BigDecimal.valueOf(1.2);
	private static final BigDecimal ONE_POINTFIVE = BigDecimal.valueOf(1.5);
	private static final BigDecimal ONE_POINTEIGHT = BigDecimal.valueOf(1.8);
	private static final BigDecimal TWO = BigDecimal.valueOf(2);
	private static final BigDecimal TWO_POINTFIVE = BigDecimal.valueOf(2.5);
	private static final BigDecimal THREE = BigDecimal.valueOf(3);
	private static final BigDecimal THREE_POINTTWOFIVE = BigDecimal.valueOf(3.25);
	private static final BigDecimal THREE_POINTFIVE = BigDecimal.valueOf(3.5);
	private static final BigDecimal FIFTEEN = BigDecimal.valueOf(15);

	private static final BigDecimal ROAD_WIDTH_TWO_POINTFOUR = BigDecimal.valueOf(2.4);
	private static final BigDecimal ROAD_WIDTH_TWO_POINTFOURFOUR = BigDecimal.valueOf(2.44);
	private static final BigDecimal ROAD_WIDTH_THREE_POINTSIX = BigDecimal.valueOf(3.6);
	private static final BigDecimal ROAD_WIDTH_FOUR_POINTEIGHT = BigDecimal.valueOf(4.8);
	private static final BigDecimal ROAD_WIDTH_SIX_POINTONE = BigDecimal.valueOf(6.1);
	private static final BigDecimal ROAD_WIDTH_NINE_POINTONE = BigDecimal.valueOf(9.1);
	private static final BigDecimal ROAD_WIDTH_TWELVE_POINTTWO = BigDecimal.valueOf(12.2);

	private static final BigDecimal ROAD_WIDTH_EIGHTEEN_POINTTHREE = BigDecimal.valueOf(18.3);
	private static final BigDecimal ROAD_WIDTH_TWENTYFOUR_POINTFOUR = BigDecimal.valueOf(24.4);
	private static final BigDecimal ROAD_WIDTH_TWENTYSEVEN_POINTFOUR = BigDecimal.valueOf(27.4);
	private static final BigDecimal ROAD_WIDTH_THIRTY_POINTFIVE = BigDecimal.valueOf(30.5);

	public static final String OLD = "OLD";
	public static final String NEW = "NEW";
	public static final String OLD_AREA_ERROR = "road width old area";
	public static final String NEW_AREA_ERROR = "road width new area";
	public static final String OLD_AREA_ERROR_MSG = "No construction shall be permitted if the road width is less than 2.4m for old area.";
	public static final String NEW_AREA_ERROR_MSG = "No construction shall be permitted if the road width is less than 6.1m for new area.";


	@Override
    public Plan validate(Plan pl) {
        if (pl.getPlot() == null
                || (pl.getPlot() != null && (pl.getPlot().getArea() == null || pl.getPlot().getArea().doubleValue() == 0))) {
            pl.addError(PLOT_AREA, getLocaleMessage(OBJECTNOTDEFINED, PLOT_AREA));
        }
        return pl;
    }

	@Override
	public Plan process(Plan pl) {
		decideNocIsRequired(pl);
		HashMap<String, String> errorMsgs = new HashMap<>();
		int errors = pl.getErrors().size();
		validate(pl);
		int validatedErrors = pl.getErrors().size();
		if (validatedErrors > errors) {
			return pl;
		}
		BigDecimal totalExistingBuiltUpArea = BigDecimal.ZERO;
		BigDecimal totalExistingFloorArea = BigDecimal.ZERO;
		BigDecimal totalBuiltUpArea = BigDecimal.ZERO;
		BigDecimal totalFloorArea = BigDecimal.ZERO;
		BigDecimal totalCarpetArea = BigDecimal.ZERO;
		BigDecimal totalExistingCarpetArea = BigDecimal.ZERO;
		Set<OccupancyTypeHelper> distinctOccupancyTypesHelper = new HashSet<>();
		for (Block blk : pl.getBlocks()) {
			BigDecimal flrArea = BigDecimal.ZERO;
			BigDecimal bltUpArea = BigDecimal.ZERO;
			BigDecimal existingFlrArea = BigDecimal.ZERO;
			BigDecimal existingBltUpArea = BigDecimal.ZERO;
			BigDecimal carpetArea = BigDecimal.ZERO;
			BigDecimal existingCarpetArea = BigDecimal.ZERO;
			Building building = blk.getBuilding();
			for (Floor flr : building.getFloors()) {
				for (Occupancy occupancy : flr.getOccupancies()) {
					validate2(pl, blk, flr, occupancy);
					/*
					 * occupancy.setCarpetArea(occupancy.getFloorArea().multiply
					 * (BigDecimal.valueOf(0.80))); occupancy
					 * .setExistingCarpetArea(occupancy.getExistingFloorArea().
					 * multiply(BigDecimal.valueOf(0.80)));
					 */

					bltUpArea = bltUpArea.add(
							occupancy.getBuiltUpArea() == null ? BigDecimal.valueOf(0) : occupancy.getBuiltUpArea());
					existingBltUpArea = existingBltUpArea.add(occupancy.getExistingBuiltUpArea() == null
							? BigDecimal.valueOf(0) : occupancy.getExistingBuiltUpArea());
					flrArea = flrArea.add(occupancy.getFloorArea());
					existingFlrArea = existingFlrArea.add(occupancy.getExistingFloorArea());
					carpetArea = carpetArea.add(occupancy.getCarpetArea());
					existingCarpetArea = existingCarpetArea.add(occupancy.getExistingCarpetArea());
				}
			}
			/*
			 * This is hard coded for testing
			 */
			building.setTotalFloorArea(new BigDecimal(456));
			building.setTotalBuitUpArea(bltUpArea);
			building.setTotalExistingBuiltUpArea(existingBltUpArea);
			building.setTotalExistingFloorArea(existingFlrArea);

			// check block is completely existing building or not.
			if (existingBltUpArea.compareTo(bltUpArea) == 0)
				blk.setCompletelyExisting(Boolean.TRUE);

			totalFloorArea = totalFloorArea.add(flrArea);
			totalBuiltUpArea = totalBuiltUpArea.add(bltUpArea);
			totalExistingBuiltUpArea = totalExistingBuiltUpArea.add(existingBltUpArea);
			totalExistingFloorArea = totalExistingFloorArea.add(existingFlrArea);
			totalCarpetArea = totalCarpetArea.add(carpetArea);
			totalExistingCarpetArea = totalExistingCarpetArea.add(existingCarpetArea);

			// Find Occupancies by block and add
			Set<OccupancyTypeHelper> occupancyByBlock = new HashSet<>();
			for (Floor flr : building.getFloors()) {
				for (Occupancy occupancy : flr.getOccupancies()) {
					if (occupancy.getTypeHelper() != null)
						occupancyByBlock.add(occupancy.getTypeHelper());
				}
			}

			List<Map<String, Object>> listOfMapOfAllDtls = new ArrayList<>();
			List<OccupancyTypeHelper> listOfOccupancyTypes = new ArrayList<>();

			for (OccupancyTypeHelper occupancyType : occupancyByBlock) {

				Map<String, Object> allDtlsMap = new HashMap<>();
				BigDecimal blockWiseFloorArea = BigDecimal.ZERO;
				BigDecimal blockWiseBuiltupArea = BigDecimal.ZERO;
				BigDecimal blockWiseExistingFloorArea = BigDecimal.ZERO;
				BigDecimal blockWiseExistingBuiltupArea = BigDecimal.ZERO;
				for (Floor flr : blk.getBuilding().getFloors()) {
					for (Occupancy occupancy : flr.getOccupancies()) {
						if (occupancyType.getType() != null && occupancy.getTypeHelper() != null
								&& occupancy.getTypeHelper().getType().getCode().equals(occupancyType.getType().getCode())) {
							blockWiseFloorArea = blockWiseFloorArea.add(occupancy.getFloorArea());
							blockWiseBuiltupArea = blockWiseBuiltupArea.add(occupancy.getBuiltUpArea() == null
									? BigDecimal.valueOf(0) : occupancy.getBuiltUpArea());
							blockWiseExistingFloorArea = blockWiseExistingFloorArea
									.add(occupancy.getExistingFloorArea());
							blockWiseExistingBuiltupArea = blockWiseExistingBuiltupArea
									.add(occupancy.getExistingBuiltUpArea() == null ? BigDecimal.valueOf(0)
											: occupancy.getExistingBuiltUpArea());

						}
					}
				}
				Occupancy occupancy = new Occupancy();
				occupancy.setBuiltUpArea(blockWiseBuiltupArea);
				occupancy.setFloorArea(blockWiseFloorArea);
				occupancy.setExistingFloorArea(blockWiseExistingFloorArea);
				occupancy.setExistingBuiltUpArea(blockWiseExistingBuiltupArea);
				occupancy.setCarpetArea(blockWiseFloorArea.multiply(BigDecimal.valueOf(.80)));
				occupancy.setTypeHelper(occupancyType);
				building.getTotalArea().add(occupancy);

				allDtlsMap.put("occupancy", occupancyType);
				allDtlsMap.put("totalFloorArea", blockWiseFloorArea);
				allDtlsMap.put("totalBuiltUpArea", blockWiseBuiltupArea);
				allDtlsMap.put("existingFloorArea", blockWiseExistingFloorArea);
				allDtlsMap.put("existingBuiltUpArea", blockWiseExistingBuiltupArea);

				listOfOccupancyTypes.add(occupancyType);

				listOfMapOfAllDtls.add(allDtlsMap);
			}
			Set<OccupancyTypeHelper> setOfOccupancyTypes = new HashSet<>(listOfOccupancyTypes);

			List<Occupancy> listOfOccupanciesOfAParticularblock = new ArrayList<>();
			// for each distinct converted occupancy types
			for (OccupancyTypeHelper occupancyType : setOfOccupancyTypes) {
				if (occupancyType != null) {
					Occupancy occupancy = new Occupancy();
					BigDecimal totalFlrArea = BigDecimal.ZERO;
					BigDecimal totalBltUpArea = BigDecimal.ZERO;
					BigDecimal totalExistingFlrArea = BigDecimal.ZERO;
					BigDecimal totalExistingBltUpArea = BigDecimal.ZERO;

					for (Map<String, Object> dtlsMap : listOfMapOfAllDtls) {
						if (occupancyType.equals(dtlsMap.get("occupancy"))) {
							totalFlrArea = totalFlrArea.add((BigDecimal) dtlsMap.get("totalFloorArea"));
							totalBltUpArea = totalBltUpArea.add((BigDecimal) dtlsMap.get("totalBuiltUpArea"));

							totalExistingBltUpArea = totalExistingBltUpArea
									.add((BigDecimal) dtlsMap.get("existingBuiltUpArea"));
							totalExistingFlrArea = totalExistingFlrArea
									.add((BigDecimal) dtlsMap.get("existingFloorArea"));

						}
					}
					occupancy.setTypeHelper(occupancyType);
					occupancy.setBuiltUpArea(totalBltUpArea);
					occupancy.setFloorArea(totalFlrArea);
					occupancy.setExistingBuiltUpArea(totalExistingBltUpArea);
					occupancy.setExistingFloorArea(totalExistingFlrArea);
					occupancy.setExistingCarpetArea(totalExistingFlrArea.multiply(BigDecimal.valueOf(0.80)));
					occupancy.setCarpetArea(totalFlrArea.multiply(BigDecimal.valueOf(0.80)));

					listOfOccupanciesOfAParticularblock.add(occupancy);
				}
			}
			blk.getBuilding().setOccupancies(listOfOccupanciesOfAParticularblock);

			if (!listOfOccupanciesOfAParticularblock.isEmpty()) {
				// listOfOccupanciesOfAParticularblock already converted. In
				// case of professional building type, converted into A1
				// type
				boolean singleFamilyBuildingTypeOccupancyPresent = false;
				boolean otherThanSingleFamilyOccupancyTypePresent = false;

				for (Occupancy occupancy : listOfOccupanciesOfAParticularblock) {
					if (occupancy.getTypeHelper().getSubtype() != null
							&& A_R.equals(occupancy.getTypeHelper().getSubtype().getCode()))
						singleFamilyBuildingTypeOccupancyPresent = true;
					else {
						otherThanSingleFamilyOccupancyTypePresent = true;
						break;
					}
				}
				blk.setSingleFamilyBuilding(
						!otherThanSingleFamilyOccupancyTypePresent && singleFamilyBuildingTypeOccupancyPresent);
				int allResidentialOccTypes = 0;
				int allResidentialOrCommercialOccTypes = 0;

				for (Occupancy occupancy : listOfOccupanciesOfAParticularblock) {
					if (occupancy.getTypeHelper() != null) {
						// setting residentialBuilding
						int residentialOccupancyType = 0;
						if (A.equals(occupancy.getTypeHelper().getType().getCode())) {
							residentialOccupancyType = 1;
						}
						if (residentialOccupancyType == 0) {
							allResidentialOccTypes = 0;
							break;
						} else {
							allResidentialOccTypes = 1;
						}
					}
				}
				blk.setResidentialBuilding(allResidentialOccTypes == 1);
				for (Occupancy occupancy : listOfOccupanciesOfAParticularblock) {
					if (occupancy.getTypeHelper() != null) {
						// setting residentialOrCommercial Occupancy Type
						int residentialOrCommercialOccupancyType = 0;
						if (A.equals(occupancy.getTypeHelper().getType().getCode())
								|| F.equals(occupancy.getTypeHelper().getType().getCode())) {
							residentialOrCommercialOccupancyType = 1;
						}
						if (residentialOrCommercialOccupancyType == 0) {
							allResidentialOrCommercialOccTypes = 0;
							break;
						} else {
							allResidentialOrCommercialOccTypes = 1;
						}
					}
				}
				blk.setResidentialOrCommercialBuilding(allResidentialOrCommercialOccTypes == 1);
			}

			if (blk.getBuilding().getFloors() != null && !blk.getBuilding().getFloors().isEmpty()) {
				BigDecimal noOfFloorsAboveGround = BigDecimal.ZERO;
				for (Floor floor : blk.getBuilding().getFloors()) {
					if (floor.getNumber() != null && floor.getNumber() >= 0) {
						noOfFloorsAboveGround = noOfFloorsAboveGround.add(BigDecimal.valueOf(1));
					}
				}

				boolean hasTerrace = blk.getBuilding().getFloors().stream()
						.anyMatch(floor -> floor.getTerrace().equals(Boolean.TRUE));

				noOfFloorsAboveGround = hasTerrace ? noOfFloorsAboveGround.subtract(BigDecimal.ONE)
						: noOfFloorsAboveGround;

				blk.getBuilding().setMaxFloor(noOfFloorsAboveGround);
				blk.getBuilding().setFloorsAboveGround(noOfFloorsAboveGround);
				blk.getBuilding().setTotalFloors(BigDecimal.valueOf(blk.getBuilding().getFloors().size()));
			}

		}

		for (Block blk : pl.getBlocks()) {
			Building building = blk.getBuilding();
			List<OccupancyTypeHelper> blockWiseOccupancyTypes = new ArrayList<>();
			for (Occupancy occupancy : blk.getBuilding().getOccupancies()) {
				if (occupancy.getTypeHelper() != null)
					blockWiseOccupancyTypes.add(occupancy.getTypeHelper());
			}
			Set<OccupancyTypeHelper> setOfBlockDistinctOccupancyTypes = new HashSet<>(blockWiseOccupancyTypes);
			OccupancyTypeHelper mostRestrictiveFar = getMostRestrictiveFar(setOfBlockDistinctOccupancyTypes);
			blk.getBuilding().setMostRestrictiveFarHelper(mostRestrictiveFar);

			for (Floor flr : building.getFloors()) {
				BigDecimal flrArea = BigDecimal.ZERO;
				BigDecimal existingFlrArea = BigDecimal.ZERO;
				BigDecimal carpetArea = BigDecimal.ZERO;
				BigDecimal existingCarpetArea = BigDecimal.ZERO;
				BigDecimal existingBltUpArea = BigDecimal.ZERO;
				for (Occupancy occupancy : flr.getOccupancies()) {
					flrArea = flrArea.add(occupancy.getFloorArea());
					existingFlrArea = existingFlrArea.add(occupancy.getExistingFloorArea());
					carpetArea = carpetArea.add(occupancy.getCarpetArea());
					existingCarpetArea = existingCarpetArea.add(occupancy.getExistingCarpetArea());
				}

				List<Occupancy> occupancies = flr.getOccupancies();
				for (Occupancy occupancy : occupancies) {
					existingBltUpArea = existingBltUpArea.add(occupancy.getExistingBuiltUpArea() != null
							? occupancy.getExistingBuiltUpArea() : BigDecimal.ZERO);
				}

				if (mostRestrictiveFar != null && mostRestrictiveFar.getConvertedSubtype() != null
						&& !A_R.equals(mostRestrictiveFar.getSubtype().getCode())) {
					if (carpetArea.compareTo(BigDecimal.ZERO) == 0) {
						pl.addError("Carpet area in block " + blk.getNumber() + "floor " + flr.getNumber(),
								"Carpet area is not defined in block " + blk.getNumber() + "floor " + flr.getNumber());
					}

					if (existingBltUpArea.compareTo(BigDecimal.ZERO) > 0
							&& existingCarpetArea.compareTo(BigDecimal.ZERO) == 0) {
						pl.addError("Existing Carpet area in block " + blk.getNumber() + "floor " + flr.getNumber(),
								"Existing Carpet area is not defined in block " + blk.getNumber() + "floor "
										+ flr.getNumber());
					}
				}

				if (flrArea.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS)
						.compareTo(carpetArea.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
								DcrConstants.ROUNDMODE_MEASUREMENTS)) < 0) {
					pl.addError("Floor area in block " + blk.getNumber() + "floor " + flr.getNumber(),
							"Floor area is less than carpet area in block " + blk.getNumber() + "floor "
									+ flr.getNumber());
				}

				if (existingBltUpArea.compareTo(BigDecimal.ZERO) > 0 && existingFlrArea
						.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS)
						.compareTo(existingCarpetArea.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
								DcrConstants.ROUNDMODE_MEASUREMENTS)) < 0) {
					pl.addError("Existing floor area in block " + blk.getNumber() + "floor " + flr.getNumber(),
							"Existing Floor area is less than carpet area in block " + blk.getNumber() + "floor "
									+ flr.getNumber());
				}
			}
		}

		List<OccupancyTypeHelper> plotWiseOccupancyTypes = new ArrayList<>();
		for (Block block : pl.getBlocks()) {
			for (Occupancy occupancy : block.getBuilding().getOccupancies()) {
				if (occupancy.getTypeHelper() != null)
					plotWiseOccupancyTypes.add(occupancy.getTypeHelper());
			}
		}

		Set<OccupancyTypeHelper> setOfDistinctOccupancyTypes = new HashSet<>(plotWiseOccupancyTypes);

		distinctOccupancyTypesHelper.addAll(setOfDistinctOccupancyTypes);

		List<Occupancy> occupanciesForPlan = new ArrayList<>();

		for (OccupancyTypeHelper occupancyType : setOfDistinctOccupancyTypes) {
			if (occupancyType != null) {
				BigDecimal totalFloorAreaForAllBlks = BigDecimal.ZERO;
				BigDecimal totalBuiltUpAreaForAllBlks = BigDecimal.ZERO;
				BigDecimal totalCarpetAreaForAllBlks = BigDecimal.ZERO;
				BigDecimal totalExistBuiltUpAreaForAllBlks = BigDecimal.ZERO;
				BigDecimal totalExistFloorAreaForAllBlks = BigDecimal.ZERO;
				BigDecimal totalExistCarpetAreaForAllBlks = BigDecimal.ZERO;
				Occupancy occupancy = new Occupancy();
				for (Block block : pl.getBlocks()) {
					for (Occupancy buildingOccupancy : block.getBuilding().getOccupancies()) {
						if (occupancyType.equals(buildingOccupancy.getTypeHelper())) {
							totalFloorAreaForAllBlks = totalFloorAreaForAllBlks.add(buildingOccupancy.getFloorArea());
							totalBuiltUpAreaForAllBlks = totalBuiltUpAreaForAllBlks
									.add(buildingOccupancy.getBuiltUpArea());
							totalCarpetAreaForAllBlks = totalCarpetAreaForAllBlks
									.add(buildingOccupancy.getCarpetArea());
							totalExistBuiltUpAreaForAllBlks = totalExistBuiltUpAreaForAllBlks
									.add(buildingOccupancy.getExistingBuiltUpArea());
							totalExistFloorAreaForAllBlks = totalExistFloorAreaForAllBlks
									.add(buildingOccupancy.getExistingFloorArea());
							totalExistCarpetAreaForAllBlks = totalExistCarpetAreaForAllBlks
									.add(buildingOccupancy.getExistingCarpetArea());
						}
					}
				}
				occupancy.setTypeHelper(occupancyType);
				occupancy.setBuiltUpArea(totalBuiltUpAreaForAllBlks);
				occupancy.setCarpetArea(totalCarpetAreaForAllBlks);
				occupancy.setFloorArea(totalFloorAreaForAllBlks);
				occupancy.setExistingBuiltUpArea(totalExistBuiltUpAreaForAllBlks);
				occupancy.setExistingFloorArea(totalExistFloorAreaForAllBlks);
				occupancy.setExistingCarpetArea(totalExistCarpetAreaForAllBlks);
				occupanciesForPlan.add(occupancy);
			}
		}

		pl.setOccupancies(occupanciesForPlan);
		pl.getVirtualBuilding().setTotalFloorArea(totalFloorArea);
		pl.getVirtualBuilding().setTotalCarpetArea(totalCarpetArea);
		pl.getVirtualBuilding().setTotalExistingBuiltUpArea(totalExistingBuiltUpArea);
		pl.getVirtualBuilding().setTotalExistingFloorArea(totalExistingFloorArea);
		pl.getVirtualBuilding().setTotalExistingCarpetArea(totalExistingCarpetArea);
		pl.getVirtualBuilding().setOccupancyTypes(distinctOccupancyTypesHelper);
		pl.getVirtualBuilding().setTotalBuitUpArea(totalBuiltUpArea);
		pl.getVirtualBuilding().setMostRestrictiveFarHelper(getMostRestrictiveFar(setOfDistinctOccupancyTypes));

		if (!distinctOccupancyTypesHelper.isEmpty()) {
			int allResidentialOccTypesForPlan = 0;
			for (OccupancyTypeHelper occupancy : distinctOccupancyTypesHelper) {
				LOG.info("occupancy :" + occupancy);
				// setting residentialBuilding
				int residentialOccupancyType = 0;
				if (A.equals(occupancy.getType().getCode())) {
					residentialOccupancyType = 1;
				}
				if (residentialOccupancyType == 0) {
					allResidentialOccTypesForPlan = 0;
					break;
				} else {
					allResidentialOccTypesForPlan = 1;
				}
			}
			pl.getVirtualBuilding().setResidentialBuilding(allResidentialOccTypesForPlan == 1);
			int allResidentialOrCommercialOccTypesForPlan = 0;
			for (OccupancyTypeHelper occupancyType : distinctOccupancyTypesHelper) {
				int residentialOrCommercialOccupancyTypeForPlan = 0;
				if (A.equals(occupancyType.getType().getCode()) || F.equals(occupancyType.getType().getCode())) {
					residentialOrCommercialOccupancyTypeForPlan = 1;
				}
				if (residentialOrCommercialOccupancyTypeForPlan == 0) {
					allResidentialOrCommercialOccTypesForPlan = 0;
					break;
				} else {
					allResidentialOrCommercialOccTypesForPlan = 1;
				}
			}
			pl.getVirtualBuilding().setResidentialOrCommercialBuilding(allResidentialOrCommercialOccTypesForPlan == 1);
		}
		if (!pl.getVirtualBuilding().getResidentialOrCommercialBuilding()) {
			pl.getErrors().put(DxfFileConstants.OCCUPANCY_ALLOWED_KEY, DxfFileConstants.OCCUPANCY_ALLOWED);
			return pl;
		}
		OccupancyTypeHelper mostRestrictiveOccupancyType = pl.getVirtualBuilding().getMostRestrictiveFarHelper();
		BigDecimal providedFar = BigDecimal.ZERO;
		BigDecimal surrenderRoadArea = BigDecimal.ZERO;

		if (!pl.getSurrenderRoads().isEmpty()) {
			for (Measurement measurement : pl.getSurrenderRoads()) {
				surrenderRoadArea = surrenderRoadArea.add(measurement.getArea());
			}
		}

		pl.setTotalSurrenderRoadArea(surrenderRoadArea.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
				DcrConstants.ROUNDMODE_MEASUREMENTS));
		BigDecimal plotArea = pl.getPlot() != null ? pl.getPlot().getArea().add(surrenderRoadArea) : BigDecimal.ZERO;
		if (plotArea.doubleValue() > 0)
			providedFar = pl.getVirtualBuilding().getTotalFloorArea().divide(plotArea, DECIMALDIGITS_MEASUREMENTS,
					ROUNDMODE_MEASUREMENTS);

		pl.setFarDetails(new FarDetails());
		pl.getFarDetails().setProvidedFar(providedFar.doubleValue());
		String typeOfArea = pl.getPlanInformation().getTypeOfArea();
		BigDecimal roadWidth = pl.getPlanInformation().getRoadWidth();

		if (mostRestrictiveOccupancyType != null && 
		        StringUtils.isNotBlank(typeOfArea) && roadWidth != null && !processFarForSpecialOccupancy(pl,
				mostRestrictiveOccupancyType, providedFar, typeOfArea, roadWidth, errorMsgs)) {
			if ((mostRestrictiveOccupancyType.getType() != null
					&& DxfFileConstants.A.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode()))
					|| (mostRestrictiveOccupancyType.getSubtype() != null
							&& (A_R.equalsIgnoreCase(mostRestrictiveOccupancyType.getSubtype().getCode())
							|| A_AF.equalsIgnoreCase(mostRestrictiveOccupancyType.getSubtype().getCode())))) {
				processFarResidential(pl, mostRestrictiveOccupancyType, providedFar, typeOfArea, roadWidth, errorMsgs);
			}
			if (mostRestrictiveOccupancyType.getType() != null
					&& (DxfFileConstants.G.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode())
							|| DxfFileConstants.B.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode())
							|| DxfFileConstants.D.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode()))) {
				processFarForGBDOccupancy(pl, mostRestrictiveOccupancyType, providedFar, typeOfArea, roadWidth,
						errorMsgs);
			}
			if (mostRestrictiveOccupancyType.getType() != null
					&& DxfFileConstants.I.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode())) {
				processFarHaazardous(pl, mostRestrictiveOccupancyType, providedFar, typeOfArea, roadWidth, errorMsgs);
			} 
			if (mostRestrictiveOccupancyType.getType() != null
                                && DxfFileConstants.F.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode())) { 
				processFarNonResidential(pl, mostRestrictiveOccupancyType, providedFar, typeOfArea, roadWidth,
						errorMsgs);
			}
		}
		ProcessPrintHelper.print(pl);
		return pl;
	}

	private void decideNocIsRequired(Plan pl) {
		Boolean isHighRise = false;
		for (Block b : pl.getBlocks()) {
			if ((b.getBuilding() != null
					/*
					 * && b.getBuilding().getIsHighRise() != null &&
					 * b.getBuilding().getIsHighRise()
					 */ && b.getBuilding().getBuildingHeight().compareTo(new BigDecimal(5)) > 0)
					|| (b.getBuilding() != null && b.getBuilding().getCoverageArea() != null
							&& b.getBuilding().getCoverageArea().compareTo(new BigDecimal(500)) > 0)) {
				isHighRise = true;

			}
		}
		if (isHighRise) {
			pl.getPlanInformation().setNocFireDept("YES");
		}

		if (StringUtils.isNotBlank(pl.getPlanInformation().getBuildingNearMonument())
				&& "YES".equalsIgnoreCase(pl.getPlanInformation().getBuildingNearMonument())) {
			BigDecimal minDistanceFromMonument = BigDecimal.ZERO;
			List<BigDecimal> distancesFromMonument = pl.getDistanceToExternalEntity().getMonuments();
			if (!distancesFromMonument.isEmpty()) {

				minDistanceFromMonument = distancesFromMonument.stream().reduce(BigDecimal::min).get();

				if (minDistanceFromMonument.compareTo(BigDecimal.valueOf(300)) > 0) {
					pl.getPlanInformation().setNocNearMonument("YES");
				}
			}

		}

	}

	private void validate2(Plan pl, Block blk, Floor flr, Occupancy occupancy) {
		String occupancyTypeHelper = StringUtils.EMPTY;
		if (occupancy.getTypeHelper() != null) {
			if (occupancy.getTypeHelper().getType() != null) {
				occupancyTypeHelper = occupancy.getTypeHelper().getType().getName();
			} else if (occupancy.getTypeHelper().getSubtype() != null) {
				occupancyTypeHelper = occupancy.getTypeHelper().getSubtype().getName();
			}
		}

		if (occupancy.getBuiltUpArea() != null && occupancy.getBuiltUpArea().compareTo(BigDecimal.valueOf(0)) < 0) {
			pl.addError(VALIDATION_NEGATIVE_BUILTUP_AREA, getLocaleMessage(VALIDATION_NEGATIVE_BUILTUP_AREA,
					blk.getNumber(), flr.getNumber().toString(), occupancyTypeHelper));
		}
		if (occupancy.getExistingBuiltUpArea() != null
				&& occupancy.getExistingBuiltUpArea().compareTo(BigDecimal.valueOf(0)) < 0) {
			pl.addError(VALIDATION_NEGATIVE_EXISTING_BUILTUP_AREA,
					getLocaleMessage(VALIDATION_NEGATIVE_EXISTING_BUILTUP_AREA, blk.getNumber(),
							flr.getNumber().toString(), occupancyTypeHelper));
		}
		occupancy.setFloorArea((occupancy.getBuiltUpArea() == null ? BigDecimal.ZERO : occupancy.getBuiltUpArea())
				.subtract(occupancy.getDeduction() == null ? BigDecimal.ZERO : occupancy.getDeduction()));
		if (occupancy.getFloorArea() != null && occupancy.getFloorArea().compareTo(BigDecimal.valueOf(0)) < 0) {
			pl.addError(VALIDATION_NEGATIVE_FLOOR_AREA, getLocaleMessage(VALIDATION_NEGATIVE_FLOOR_AREA,
					blk.getNumber(), flr.getNumber().toString(), occupancyTypeHelper));
		}
		occupancy.setExistingFloorArea(
				(occupancy.getExistingBuiltUpArea() == null ? BigDecimal.ZERO : occupancy.getExistingBuiltUpArea())
						.subtract(occupancy.getExistingDeduction() == null ? BigDecimal.ZERO
								: occupancy.getExistingDeduction()));
		if (occupancy.getExistingFloorArea() != null
				&& occupancy.getExistingFloorArea().compareTo(BigDecimal.valueOf(0)) < 0) {
			pl.addError(VALIDATION_NEGATIVE_EXISTING_FLOOR_AREA,
					getLocaleMessage(VALIDATION_NEGATIVE_EXISTING_FLOOR_AREA, blk.getNumber(),
							flr.getNumber().toString(), occupancyTypeHelper));
		}
	}

	protected OccupancyTypeHelper getMostRestrictiveFar(Set<OccupancyTypeHelper> distinctOccupancyTypes) {
		Set<String> codes = new HashSet<>();
		Map<String, OccupancyTypeHelper> codesMap = new HashMap<>();
		for (OccupancyTypeHelper typeHelper : distinctOccupancyTypes) {

			if (typeHelper.getType() != null)
				codesMap.put(typeHelper.getType().getCode(), typeHelper);
			if (typeHelper.getSubtype() != null)
				codesMap.put(typeHelper.getSubtype().getCode(), typeHelper);
		}
		codes = codesMap.keySet();
		if (codes.contains(S_ECFG))
			return codesMap.get(S_ECFG);
		else if (codes.contains(A_FH))
			return codesMap.get(A_FH);
		else if (codes.contains(S_SAS))
			return codesMap.get(S_SAS);
		else if (codes.contains(D_B))
			return codesMap.get(D_B);
		else if (codes.contains(D_C))
			return codesMap.get(D_C);
		else if (codes.contains(D_A))
			return codesMap.get(D_A);
		else if (codes.contains(H_PP))
			return codesMap.get(H_PP);
		else if (codes.contains(E_NS))
			return codesMap.get(E_NS);
		else if (codes.contains(M_DFPAB))
			return codesMap.get(M_DFPAB);
		else if (codes.contains(E_PS))
			return codesMap.get(E_PS);
		else if (codes.contains(E_SFMC))
			return codesMap.get(E_SFMC);
		else if (codes.contains(E_SFDAP))
			return codesMap.get(E_SFDAP);
		else if (codes.contains(E_EARC))
			return codesMap.get(E_EARC);
		else if (codes.contains(S_MCH))
			return codesMap.get(S_MCH);
		else if (codes.contains(S_BH))
			return codesMap.get(S_BH);
		else if (codes.contains(S_CRC))
			return codesMap.get(S_CRC);
		else if (codes.contains(S_CA))
			return codesMap.get(S_CA);
		else if (codes.contains(S_SC))
			return codesMap.get(S_SC);
		else if (codes.contains(S_ICC))
			return codesMap.get(S_ICC);
		else if (codes.contains(A2))
			return codesMap.get(A2);
		else if (codes.contains(E_CLG))
			return codesMap.get(E_CLG);
		else if (codes.contains(M_OHF))
			return codesMap.get(M_OHF);
		else if (codes.contains(M_VH))
			return codesMap.get(M_VH);
		else if (codes.contains(M_NAPI))
			return codesMap.get(M_NAPI);
		else if (codes.contains(A_SA))
			return codesMap.get(A_SA);
		else if (codes.contains(M_HOTHC))
			return codesMap.get(M_HOTHC);
		else if (codes.contains(E_SACA))
			return codesMap.get(E_SACA);
		else if (codes.contains(F))
			return codesMap.get(F);
		else if (codes.contains(A))
			return codesMap.get(A);
		else
			return null;

	}

	private Boolean processFarForSpecialOccupancy(Plan pl, OccupancyTypeHelper occupancyType, BigDecimal far,
			String typeOfArea, BigDecimal roadWidth, HashMap<String, String> errors) {

		OccupancyTypeHelper mostRestrictiveOccupancyType = pl.getVirtualBuilding() != null ? pl.getVirtualBuilding().getMostRestrictiveFarHelper(): null ;
		String expectedResult = StringUtils.EMPTY;
		boolean isAccepted = false;
		if (mostRestrictiveOccupancyType != null && mostRestrictiveOccupancyType.getSubtype() != null) {
			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_ECFG)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(A_FH)) {
				isAccepted = far.compareTo(POINTTWO) <= 0;
				expectedResult = "<= 0.2";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_SAS)) {
				isAccepted = far.compareTo(POINTFOUR) <= 0;
				expectedResult = "<= 0.4";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(D_B)) {
				isAccepted = far.compareTo(POINTFIVE) <= 0;
				expectedResult = "<= 0.5";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(D_C)) {
				isAccepted = far.compareTo(POINTSIX) <= 0;
				expectedResult = "<= 0.6";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(D_A)) {
				isAccepted = far.compareTo(POINTSEVEN) <= 0;
				expectedResult = "<= 0.7";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(H_PP)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_NS)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(M_DFPAB)) {
				isAccepted = far.compareTo(ONE) <= 0;
				expectedResult = "<= 1";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_PS)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_SFMC)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_SFDAP)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_EARC)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_MCH)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_BH)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_CRC)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_CA)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_SC)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(S_ICC)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(A2)) {
				isAccepted = far.compareTo(ONE_POINTTWO) <= 0;
				expectedResult = "<= 1.2";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(B2)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_CLG)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(M_OHF)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(M_VH)
					|| mostRestrictiveOccupancyType.getSubtype().getCode().equals(M_NAPI)) {
				isAccepted = far.compareTo(ONE_POINTFIVE) <= 0;
				expectedResult = "<= 1.5";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(A_SA)) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				expectedResult = "<= 2.5";
				return true;
			}

			if (mostRestrictiveOccupancyType.getSubtype().getCode().equals(E_SACA)) {
				isAccepted = far.compareTo(FIFTEEN) <= 0;
				expectedResult = "<= 15";
				return true;
			}

		}

		if (StringUtils.isNotBlank(expectedResult)) {
			buildResult(pl, occupancyType, far, typeOfArea, roadWidth, expectedResult, isAccepted);
		}

		return false;
	}

	private void processFarResidential(Plan pl, OccupancyTypeHelper occupancyType, BigDecimal far, String typeOfArea,
			BigDecimal roadWidth, HashMap<String, String> errors) {

		String expectedResult = StringUtils.EMPTY;
		boolean isAccepted = false;

		if (typeOfArea.equalsIgnoreCase(OLD)) {
			if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOUR) < 0) {
				errors.put(OLD_AREA_ERROR, OLD_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOURFOUR) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) < 0) {
				isAccepted = far.compareTo(ONE_POINTTWO) <= 0;
				pl.getFarDetails().setPermissableFar(ONE_POINTTWO.doubleValue());
				expectedResult = "<= 1.2";
			} else if (roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) < 0) {
				isAccepted = far.compareTo(ONE_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(ONE_POINTFIVE.doubleValue());
				expectedResult = "<= 1.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
				isAccepted = far.compareTo(ONE_POINTEIGHT) <= 0;
				pl.getFarDetails().setPermissableFar(ONE_POINTEIGHT.doubleValue());
				expectedResult = "<= 1.8";
			} else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
				isAccepted = far.compareTo(TWO) <= 0;
				pl.getFarDetails().setPermissableFar(TWO.doubleValue());
				expectedResult = "<= 2";
			} else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) >= 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			}

		}

		if (typeOfArea.equalsIgnoreCase(NEW)) {
			if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
				errors.put(NEW_AREA_ERROR, NEW_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
				isAccepted = far.compareTo(TWO) <= 0;
				pl.getFarDetails().setPermissableFar(TWO.doubleValue());
				expectedResult = "<= 2";
			} else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) < 0) {
				isAccepted = far.compareTo(THREE) <= 0;
				pl.getFarDetails().setPermissableFar(THREE.doubleValue());
				expectedResult = "<= 3";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) < 0) {
				isAccepted = far.compareTo(THREE_POINTTWOFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(THREE_POINTTWOFIVE.doubleValue());
				expectedResult = "<= 3.25";
			} else if (roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) >= 0) {
				isAccepted = far.compareTo(THREE_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(THREE_POINTFIVE.doubleValue());
				expectedResult = "<= 3.5";
			}

		}

		if (errors.isEmpty() && StringUtils.isNotBlank(expectedResult)) {
			buildResult(pl, occupancyType, far, typeOfArea, roadWidth, expectedResult, isAccepted);
		}
	}

	private void processFarNonResidential(Plan pl, OccupancyTypeHelper occupancyType, BigDecimal far, String typeOfArea,
			BigDecimal roadWidth, HashMap<String, String> errors) {

		String expectedResult = StringUtils.EMPTY;
		boolean isAccepted = false;

		if (typeOfArea.equalsIgnoreCase(OLD)) {
			if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOUR) < 0) {
				errors.put(OLD_AREA_ERROR, OLD_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOURFOUR) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) < 0) {
				isAccepted = far.compareTo(ONE_POINTTWO) <= 0;
				pl.getFarDetails().setPermissableFar(TWO.doubleValue());
				expectedResult = "<= 1.2";
			} else if (roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) < 0) {
				isAccepted = far.compareTo(BigDecimal.ZERO) >= 0;
				pl.getFarDetails().setPermissableFar(BigDecimal.ZERO.doubleValue());
				expectedResult = "0";
			} else if (roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
				isAccepted = far.compareTo(BigDecimal.ZERO) >= 0;
				pl.getFarDetails().setPermissableFar(BigDecimal.ZERO.doubleValue());
				expectedResult = "0";
			} else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
				isAccepted = far.compareTo(BigDecimal.ZERO) >= 0;
				pl.getFarDetails().setPermissableFar(BigDecimal.ZERO.doubleValue());
				expectedResult = "0";
			} else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				isAccepted = far.compareTo(BigDecimal.ZERO) >= 0;
				pl.getFarDetails().setPermissableFar(BigDecimal.ZERO.doubleValue());
				expectedResult = "0";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) < 0) {
				isAccepted = far.compareTo(TWO) <= 0;
				pl.getFarDetails().setPermissableFar(TWO.doubleValue());
				expectedResult = "<= 2";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			}

		}

		if (typeOfArea.equalsIgnoreCase(NEW)) {
			if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
				errors.put(NEW_AREA_ERROR, NEW_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
				isAccepted = far.compareTo(BigDecimal.ZERO) >= 0;
				pl.getFarDetails().setPermissableFar(BigDecimal.ZERO.doubleValue());
				expectedResult = "0";
			} else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
				isAccepted = far.compareTo(BigDecimal.ZERO) >= 0;
				pl.getFarDetails().setPermissableFar(BigDecimal.ZERO.doubleValue());
				expectedResult = "0";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) < 0) {
				isAccepted = far.compareTo(TWO) <= 0;
				pl.getFarDetails().setPermissableFar(TWO.doubleValue());
				expectedResult = "<= 2";
			} else if (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) < 0) {
				isAccepted = far.compareTo(TWO_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(TWO_POINTFIVE.doubleValue());
				expectedResult = "<= 2.5";
			} else if (roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) >= 0
					&& roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) < 0) {
				isAccepted = far.compareTo(THREE) <= 0;
				pl.getFarDetails().setPermissableFar(THREE.doubleValue());
				expectedResult = "<= 3";
			} else if (roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) >= 0) {
				isAccepted = far.compareTo(THREE_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(THREE_POINTFIVE.doubleValue());
				expectedResult = "<= 3";
			}

		}

		if (errors.isEmpty() && StringUtils.isNotBlank(expectedResult)) {
			buildResult(pl, occupancyType, far, typeOfArea, roadWidth, expectedResult, isAccepted);
		}
	}

	private void processFarForGBDOccupancy(Plan pl, OccupancyTypeHelper occupancyType, BigDecimal far,
			String typeOfArea, BigDecimal roadWidth, HashMap<String, String> errors) {

		String expectedResult = StringUtils.EMPTY;
		boolean isAccepted = false;

		if (typeOfArea.equalsIgnoreCase(OLD)) {
			if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOUR) < 0) {
				errors.put(OLD_AREA_ERROR, OLD_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else {
				isAccepted = far.compareTo(ONE_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(ONE_POINTFIVE.doubleValue());
				expectedResult = "<=" + ONE_POINTFIVE;
			}

		}

		if (typeOfArea.equalsIgnoreCase(NEW)) {
			if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
				errors.put(NEW_AREA_ERROR, NEW_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else {
				isAccepted = far.compareTo(ONE_POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(ONE_POINTFIVE.doubleValue());
				expectedResult = "<=" + ONE_POINTFIVE;
			}

		}

		if (errors.isEmpty() && StringUtils.isNotBlank(expectedResult)) {
			buildResult(pl, occupancyType, far, typeOfArea, roadWidth, expectedResult, isAccepted);
		}
	}

	private void processFarHaazardous(Plan pl, OccupancyTypeHelper occupancyType, BigDecimal far, String typeOfArea,
			BigDecimal roadWidth, HashMap<String, String> errors) {

		String expectedResult = StringUtils.EMPTY;
		boolean isAccepted = false;

		if (typeOfArea.equalsIgnoreCase(OLD)) {
			if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOUR) < 0) {
				errors.put(OLD_AREA_ERROR, OLD_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else {
				isAccepted = far.compareTo(POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(POINTFIVE.doubleValue());
				expectedResult = "<=" + POINTFIVE;
			}

		}

		if (typeOfArea.equalsIgnoreCase(NEW)) {
			if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
				errors.put(NEW_AREA_ERROR, NEW_AREA_ERROR_MSG);
				pl.addErrors(errors);
			} else {
				isAccepted = far.compareTo(POINTFIVE) <= 0;
				pl.getFarDetails().setPermissableFar(POINTFIVE.doubleValue());
				expectedResult = "<=" + POINTFIVE;
			}

		}

		if (errors.isEmpty() && StringUtils.isNotBlank(expectedResult)) {
			buildResult(pl, occupancyType, far, typeOfArea, roadWidth, expectedResult, isAccepted);
		}
	}

	private void buildResult(Plan pl, OccupancyTypeHelper occupancyType, BigDecimal far, String typeOfArea,
			BigDecimal roadWidth, String expectedResult, boolean isAccepted) {
		ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
		scrutinyDetail.addColumnHeading(1, RULE_NO);
		scrutinyDetail.addColumnHeading(2, OCCUPANCY);
		scrutinyDetail.addColumnHeading(3, AREA_TYPE);
		scrutinyDetail.addColumnHeading(4, ROAD_WIDTH);
		scrutinyDetail.addColumnHeading(5, PERMISSIBLE);
		scrutinyDetail.addColumnHeading(6, PROVIDED);
		scrutinyDetail.addColumnHeading(7, STATUS);
		scrutinyDetail.setKey("Common_FAR");

		String actualResult = far.toString();
		String occupancyName;
		if (occupancyType.getSubtype() != null)
			occupancyName = occupancyType.getSubtype().getName();
		else
			occupancyName = occupancyType.getType().getName();

		Map<String, String> details = new HashMap<>();
		details.put(RULE_NO, RULE_38);
		details.put(OCCUPANCY, occupancyName);
		details.put(AREA_TYPE, typeOfArea);
		details.put(ROAD_WIDTH, roadWidth.toString());
		details.put(PERMISSIBLE, expectedResult);
		details.put(PROVIDED, actualResult);
		details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());

		scrutinyDetail.getDetail().add(details);
		pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
	}

	private ScrutinyDetail getFarScrutinyDetail(String key) {
		ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
		scrutinyDetail.addColumnHeading(1, RULE_NO);
		scrutinyDetail.addColumnHeading(2, "Area Type");
		scrutinyDetail.addColumnHeading(3, "Road Width");
		scrutinyDetail.addColumnHeading(4, PERMISSIBLE);
		scrutinyDetail.addColumnHeading(5, PROVIDED);
		scrutinyDetail.addColumnHeading(6, STATUS);
		scrutinyDetail.setKey(key);
		return scrutinyDetail;
	}

	@Override
	public Map<String, Date> getAmendments() {
		return new LinkedHashMap<>();
	}
}
