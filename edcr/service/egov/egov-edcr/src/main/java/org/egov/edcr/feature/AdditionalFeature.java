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

import static org.egov.edcr.utility.DcrConstants.DECIMALDIGITS_MEASUREMENTS;
import static org.egov.edcr.utility.DcrConstants.ROUNDMODE_MEASUREMENTS;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.common.entity.edcr.SetBack;
import org.egov.common.entity.edcr.Yard;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.utils.StringUtils;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AdditionalFeature extends FeatureProcess {
    private static final Logger LOG = LogManager.getLogger(AdditionalFeature.class);

    private static final String RULE_38 = "38";
    private static final String RULE_39 = "39";
    private static final String RULE_41_I_A = "41-i-a";
    private static final String RULE_41_I_B = "41-i-b";
    private static final String RULE_47 = "47";
    private static final String RULE_50 = "50";
    private static final String RULE_56 = "56";
    private static final BigDecimal TWO = BigDecimal.valueOf(2);
    private static final BigDecimal ONE_POINTFIVE = BigDecimal.valueOf(1.5);
    private static final BigDecimal THREE = BigDecimal.valueOf(3);
    private static final BigDecimal FOUR = BigDecimal.valueOf(4);
    private static final BigDecimal SIX = BigDecimal.valueOf(6);
    private static final BigDecimal SEVEN = BigDecimal.valueOf(7);
    private static final BigDecimal TEN = BigDecimal.valueOf(10);
    private static final BigDecimal TWELVE = BigDecimal.valueOf(12);
    private static final BigDecimal NINETEEN = BigDecimal.valueOf(19);

    private static final BigDecimal ROAD_WIDTH_TWO_POINTFOUR = BigDecimal.valueOf(2.4);
    private static final BigDecimal ROAD_WIDTH_TWO_POINTFOURFOUR = BigDecimal.valueOf(2.44);
    private static final BigDecimal ROAD_WIDTH_THREE_POINTSIX = BigDecimal.valueOf(3.6);
    private static final BigDecimal ROAD_WIDTH_FOUR_POINTEIGHT = BigDecimal.valueOf(4.8);
    private static final BigDecimal ROAD_WIDTH_SIX_POINTONE = BigDecimal.valueOf(6.1);
    private static final BigDecimal ROAD_WIDTH_NINE_POINTONE = BigDecimal.valueOf(9.1);
    private static final BigDecimal ROAD_WIDTH_TWELVE_POINTTWO = BigDecimal.valueOf(12.2);

    private static final int PLOTAREA_100 = 100;
    private static final int PLOTAREA_300 = 300;
    private static final int PLOTAREA_500 = 500;
    private static final int PLOTAREA_1000 = 1000;
    private static final int PLOTAREA_3000 = 3000;
    /*
     * private static final BigDecimal ROAD_WIDTH_EIGHTEEN_POINTTHREE = BigDecimal.valueOf(18.3); private static final BigDecimal
     * ROAD_WIDTH_TWENTYFOUR_POINTFOUR = BigDecimal.valueOf(24.4); private static final BigDecimal
     * ROAD_WIDTH_TWENTYSEVEN_POINTFOUR = BigDecimal.valueOf(27.4); private static final BigDecimal ROAD_WIDTH_THIRTY_POINTFIVE =
     * BigDecimal.valueOf(30.5);
     */

    public static final String OLD = "OLD";
    public static final String NEW = "NEW";
    public static final String OLD_AREA_ERROR = "road width old area";
    public static final String NEW_AREA_ERROR = "road width new area";
    public static final String OLD_AREA_ERROR_MSG = "No construction shall be permitted if the road width is less than 2.4m for old area.";
    public static final String NEW_AREA_ERROR_MSG = "No construction shall be permitted if the road width is less than 6.1m for new area.";
    public static final String NO_OF_FLOORS = "Maximum number of floors allowed";
    public static final String HEIGHT_BUILDING = "Maximum height of building allowed";
    public static final String MIN_PLINTH_HEIGHT = " >= 0.45";
    public static final String MIN_PLINTH_HEIGHT_DESC = "Minimum plinth height";
    public static final String MAX_BSMNT_CELLAR = "Number of basement/cellar allowed";
    public static final String MIN_INT_COURT_YARD = "0.15";
    public static final String MIN_INT_COURT_YARD_DESC = "Minimum interior courtyard";
    public static final String BARRIER_FREE_ACCESS_FOR_PHYSICALLY_CHALLENGED_PEOPLE_DESC = "Barrier free access for physically challenged people";
    public static final String GREEN_BUILDINGS_AND_SUSTAINABILITY_PROVISIONS_ERROR_CODE = "Green buildings and sustainability provisions";
    public static final String GREEN_BUILDINGS_AND_SUSTAINABILITY_PROVISIONS_ERROR_MSG = "Green buildings and sustainability provision should be YES";
    public static final String GREEN_BUILDINGS_AND_SUSTAINABILITY = "Green buildings and sustainability provisions";
    public static final String FIRE_PROTECTION_AND_FIRE_SAFETY_REQUIREMENTS_DESC = "Fire Protection And Fire Safety Requirements";

    @Override
    public Plan validate(Plan pl) {
        HashMap<String, String> errors = new HashMap<>();

        List<Block> blocks = pl.getBlocks();

        for (Block block : blocks) {
            if (block.getBuilding() != null) {
                if (block.getBuilding().getBuildingHeight().compareTo(BigDecimal.ZERO) == 0) {
                    errors.put(String.format(DcrConstants.BLOCK_BUILDING_HEIGHT, block.getNumber()),
                            edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
                                    new String[] {
                                            String.format(DcrConstants.BLOCK_BUILDING_HEIGHT, block.getNumber()) },
                                    LocaleContextHolder.getLocale()));
                    pl.addErrors(errors);
                }
            }
        }

        /*
         * if (Plan.getPlot() != null && Plan.getPlot().getPlotBndryArea() != null && Plan.getPlanInformation().getPlotArea() !=
         * null){ BigDecimal plotBndryArea = Plan.getPlot().getPlotBndryArea().setScale(0, RoundingMode.UP); BigDecimal plotArea =
         * Plan.getPlanInformation().getPlotArea().setScale(0, RoundingMode.UP); if (plotBndryArea.compareTo(plotArea) > 0)
         * Plan.addError( "plot boundary greater", String.format(PLOT_BOUNDARY_AREA_GREATER, Plan.getPlot().getPlotBndryArea(),
         * Plan.getPlanInformation().getPlotArea())); }
         */
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        HashMap<String, String> errors = new HashMap<>();
        validate(pl);

        String typeOfArea = pl.getPlanInformation().getTypeOfArea();
        BigDecimal roadWidth = pl.getPlanInformation().getRoadWidth();

        if (StringUtils.isNotBlank(typeOfArea) && roadWidth != null) {
            validateNumberOfFloors(pl, errors, typeOfArea, roadWidth);
            validateHeightOfBuilding(pl, errors, typeOfArea, roadWidth);
        }

        validatePlinthHeight(pl, errors);
        // validateIntCourtYard(pl, errors);
        validateBarrierFreeAccess(pl, errors);
        validateBasement(pl, errors);
        validateGreenBuildingsAndSustainability(pl, errors);
        validateFireDeclaration(pl, errors);

        return pl;
    }

    private void validateFireDeclaration(Plan pl, HashMap<String, String> errors) {
        ScrutinyDetail scrutinyDetail = getNewScrutinyDetail("Fire Protection And Fire Safety Requirements");
        OccupancyTypeHelper mostRestrictiveOccupancyType = pl.getVirtualBuilding() != null
                ? pl.getVirtualBuilding().getMostRestrictiveFarHelper()
                : null;
        if (pl.getBlocks() != null && !pl.getBlocks().isEmpty()) {
            for (Block b : pl.getBlocks()) {
                if (b.getBuilding() != null && (b.getBuilding().getIsHighRise()
                        || isCommercialAbv750sqm(pl, mostRestrictiveOccupancyType)))
                    if (pl.getPlanInformation() != null
                            && !pl.getPlanInformation().getFireProtectionAndFireSafetyRequirements().isEmpty()) {
                        Map<String, String> details = new HashMap<>();
                        details.put(RULE_NO, RULE_56);
                        details.put(DESCRIPTION, FIRE_PROTECTION_AND_FIRE_SAFETY_REQUIREMENTS_DESC);
                        details.put(PERMISSIBLE, "YES/NO/NA");
                        details.put(PROVIDED, pl.getPlanInformation().getFireProtectionAndFireSafetyRequirements());
                        details.put(STATUS, Result.Accepted.getResultVal());
                        scrutinyDetail.getDetail().add(details);
                        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
                    } else {
                        Map<String, String> details = new HashMap<>();
                        details.put(RULE_NO, RULE_56);
                        details.put(DESCRIPTION, FIRE_PROTECTION_AND_FIRE_SAFETY_REQUIREMENTS_DESC);
                        details.put(PERMISSIBLE, "YES/NO/NA");
                        details.put(PROVIDED, pl.getPlanInformation().getFireProtectionAndFireSafetyRequirements());
                        details.put(STATUS, Result.Not_Accepted.getResultVal());
                        scrutinyDetail.getDetail().add(details);
                        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
                    }
            }
        }

    }

    private boolean isCommercialAbv750sqm(Plan pl, OccupancyTypeHelper mostRestrictiveOccupancyType) {
        return pl.getVirtualBuilding() != null && mostRestrictiveOccupancyType != null
                && mostRestrictiveOccupancyType.getType() != null
                && DxfFileConstants.F.equalsIgnoreCase(mostRestrictiveOccupancyType.getType().getCode())
                && pl.getVirtualBuilding().getTotalCoverageArea().compareTo(BigDecimal.valueOf(750)) > 0;
    }

    private void validateBarrierFreeAccess(Plan pl, HashMap<String, String> errors) {
        ScrutinyDetail scrutinyDetail = getNewScrutinyDetail("Barrier Free Access For Physically Challenged People");
        if (pl.getVirtualBuilding() != null && pl.getVirtualBuilding().getMostRestrictiveFarHelper() != null
                && pl.getVirtualBuilding().getMostRestrictiveFarHelper().getSubtype() != null && !DxfFileConstants.A_R
                        .equals(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getSubtype().getCode())
                && pl.getPlot() != null && pl.getPlot().getArea().compareTo(new BigDecimal(2000)) > 0) {

            if (pl.getPlanInformation() != null
                    && !pl.getPlanInformation().getBarrierFreeAccessForPhyChlngdPpl().isEmpty()
                    && DcrConstants.YES.equals(pl.getPlanInformation().getBarrierFreeAccessForPhyChlngdPpl())) {

                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, RULE_50);
                details.put(DESCRIPTION, BARRIER_FREE_ACCESS_FOR_PHYSICALLY_CHALLENGED_PEOPLE_DESC);
                details.put(PERMISSIBLE, DcrConstants.YES);
                details.put(PROVIDED, DcrConstants.YES);
                details.put(STATUS, Result.Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

            } else {
                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, RULE_50);
                details.put(DESCRIPTION, BARRIER_FREE_ACCESS_FOR_PHYSICALLY_CHALLENGED_PEOPLE_DESC);
                details.put(PERMISSIBLE, "YES");
                details.put(PROVIDED, pl.getPlanInformation().getBarrierFreeAccessForPhyChlngdPpl());
                details.put(STATUS, Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }
        }

    }

    private void validateNumberOfFloors(Plan pl, HashMap<String, String> errors, String typeOfArea,
            BigDecimal roadWidth) {
        for (Block block : pl.getBlocks()) {

            boolean isAccepted = false;
            ScrutinyDetail scrutinyDetail = getNewScrutinyDetailRoadArea(
                    "Block_" + block.getNumber() + "_" + "Number of Floors");
            BigDecimal floorAbvGround = block.getBuilding().getFloorsAboveGround();
            String requiredFloorCount = StringUtils.EMPTY;

            if (typeOfArea.equalsIgnoreCase(OLD)) {
                if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOUR) < 0) {
                    errors.put(OLD_AREA_ERROR, OLD_AREA_ERROR_MSG);
                    pl.addErrors(errors);
                } else if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOURFOUR) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) < 0) {
                    isAccepted = floorAbvGround.compareTo(TWO) <= 0;
                    requiredFloorCount = "<= 2";
                } else if (roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) < 0) {
                    isAccepted = floorAbvGround.compareTo(THREE) <= 0;
                    requiredFloorCount = "<= 3";
                } else if (roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
                    isAccepted = floorAbvGround.compareTo(THREE) <= 0;
                    requiredFloorCount = "<= 3";
                } else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
                    isAccepted = floorAbvGround.compareTo(FOUR) <= 0;
                    requiredFloorCount = "<= 4";
                } /*
                   * else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) <= 0) { return BETWEEN_NINEPOINT_ONE_TWELVEPOINT_TWO; } else
                   * if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) <= 0) { return
                   * BETWEEN_TWELVEPOINT_TWO_EIGHTEENPOINT_THREE; } else if (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE)
                   * >= 0 && roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) <= 0) { return
                   * BETWEEN_EIGHTEENPOINT_THREE_TWENTYFOURPOINT_FOUR; } else if
                   * (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) <= 0) { return
                   * BETWEEN_TWENTYFOURPOINT_FOUR_TWENTYSEVENPOINT_FOUR; } else if
                   * (roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) <= 0) { return
                   * BETWEEN_TENTYSEVENPOINT_FOUR_THRITYPOINT_FIVE; }
                   */
            }

            if (typeOfArea.equalsIgnoreCase(NEW)) {
                if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
                    errors.put(NEW_AREA_ERROR, NEW_AREA_ERROR_MSG);
                    pl.addErrors(errors);
                } else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
                    isAccepted = floorAbvGround.compareTo(FOUR) <= 0;
                    requiredFloorCount = "<= 4";
                } else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
                    isAccepted = floorAbvGround.compareTo(SIX) <= 0;
                    requiredFloorCount = "<= 6";
                } /*
                   * else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) <= 0) { return
                   * BETWEEN_TWELVEPOINT_TWO_EIGHTEENPOINT_THREE; } else if (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE)
                   * >= 0 && roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) <= 0) { return
                   * BETWEEN_EIGHTEENPOINT_THREE_TWENTYFOURPOINT_FOUR; } else if
                   * (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) <= 0) { return
                   * BETWEEN_TWENTYFOURPOINT_FOUR_TWENTYSEVENPOINT_FOUR; } else if
                   * (roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) <= 0) { return
                   * BETWEEN_TENTYSEVENPOINT_FOUR_THRITYPOINT_FIVE; }
                   */
            }

            if (errors.isEmpty() && StringUtils.isNotBlank(requiredFloorCount)) {
                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, RULE_38);
                details.put(DESCRIPTION, NO_OF_FLOORS);
                details.put(DxfFileConstants.AREA_TYPE, typeOfArea);
                details.put(DxfFileConstants.ROAD_WIDTH, roadWidth.toString());
                details.put(PERMISSIBLE, requiredFloorCount);
                details.put(PROVIDED, String.valueOf(block.getBuilding().getFloorsAboveGround()));
                details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }
        }
    }

    private void validateHeightOfBuilding(Plan pl, HashMap<String, String> errors, String typeOfArea,
            BigDecimal roadWidth) {

        for (Block block : pl.getBlocks()) {

            boolean isAccepted = false;
            String ruleNo = RULE_38;
            ScrutinyDetail scrutinyDetail = getNewScrutinyDetailRoadArea(
                    "Block_" + block.getNumber() + "_" + "Height of Building");
            String requiredBuildingHeight = StringUtils.EMPTY;
            BigDecimal buildingHeight = block.getBuilding().getBuildingHeight();

            if (typeOfArea.equalsIgnoreCase(OLD)) {
                if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOUR) < 0) {
                    errors.put(OLD_AREA_ERROR, OLD_AREA_ERROR_MSG);
                    pl.addErrors(errors);
                } else if (roadWidth.compareTo(ROAD_WIDTH_TWO_POINTFOURFOUR) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) < 0) {
                    isAccepted = buildingHeight.compareTo(SEVEN) <= 0;
                    requiredBuildingHeight = "<= 7";
                } else if (roadWidth.compareTo(ROAD_WIDTH_THREE_POINTSIX) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) < 0) {
                    isAccepted = buildingHeight.compareTo(TEN) <= 0;
                    requiredBuildingHeight = "<= 10";
                } else if (roadWidth.compareTo(ROAD_WIDTH_FOUR_POINTEIGHT) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
                    isAccepted = buildingHeight.compareTo(TEN) <= 0;
                    requiredBuildingHeight = "<= 10";
                } else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
                    isAccepted = buildingHeight.compareTo(TWELVE) <= 0;
                    requiredBuildingHeight = "<= 12";
                } else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0) {
                    List<SetBack> setBacks = block.getSetBacks();
                    BigDecimal permitedHeight = getPermitedHeight(roadWidth, setBacks);
                    isAccepted = buildingHeight.compareTo(permitedHeight) <= 0;
                    requiredBuildingHeight = "<=" + permitedHeight.toString();
                    ruleNo = RULE_39;
                }
                /*
                 * else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0 && roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO)
                 * <= 0) { return BETWEEN_NINEPOINT_ONE_TWELVEPOINT_TWO; } else if
                 * (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0 && roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) <=
                 * 0) { return BETWEEN_TWELVEPOINT_TWO_EIGHTEENPOINT_THREE; } else if
                 * (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) >= 0 &&
                 * roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) <= 0) { return
                 * BETWEEN_EIGHTEENPOINT_THREE_TWENTYFOURPOINT_FOUR; } else if
                 * (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0 &&
                 * roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) <= 0) { return
                 * BETWEEN_TWENTYFOURPOINT_FOUR_TWENTYSEVENPOINT_FOUR; } else if
                 * (roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) >= 0 && roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE)
                 * <= 0) { return BETWEEN_TENTYSEVENPOINT_FOUR_THRITYPOINT_FIVE; }
                 */

            }

            if (typeOfArea.equalsIgnoreCase(NEW)) {
                if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) < 0) {
                    errors.put(NEW_AREA_ERROR, NEW_AREA_ERROR_MSG);
                    pl.addErrors(errors);
                } else if (roadWidth.compareTo(ROAD_WIDTH_SIX_POINTONE) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) < 0) {
                    isAccepted = buildingHeight.compareTo(TWELVE) <= 0;
                    requiredBuildingHeight = "<= 12";
                } else if (roadWidth.compareTo(ROAD_WIDTH_NINE_POINTONE) >= 0
                        && roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) < 0) {
                    isAccepted = buildingHeight.compareTo(NINETEEN) <= 0;
                    requiredBuildingHeight = "<= 19";
                } else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) > 0) {
                    List<SetBack> setBacks = block.getSetBacks();
                    BigDecimal permitedHeight = getPermitedHeight(roadWidth, setBacks);
                    isAccepted = buildingHeight.compareTo(permitedHeight) <= 0;
                    requiredBuildingHeight = "<=" + permitedHeight.toString();
                } /*
                   * else if (roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE) <= 0) { return
                   * BETWEEN_TWELVEPOINT_TWO_EIGHTEENPOINT_THREE; } else if (roadWidth.compareTo(ROAD_WIDTH_EIGHTEEN_POINTTHREE)
                   * >= 0 && roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) <= 0) { return
                   * BETWEEN_EIGHTEENPOINT_THREE_TWENTYFOURPOINT_FOUR; } else if
                   * (roadWidth.compareTo(ROAD_WIDTH_TWENTYFOUR_POINTFOUR) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) <= 0) { return
                   * BETWEEN_TWENTYFOURPOINT_FOUR_TWENTYSEVENPOINT_FOUR; } else if
                   * (roadWidth.compareTo(ROAD_WIDTH_TWENTYSEVEN_POINTFOUR) >= 0 &&
                   * roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) <= 0) { return
                   * BETWEEN_TENTYSEVENPOINT_FOUR_THRITYPOINT_FIVE; }
                   */

            }

            if (errors.isEmpty() && StringUtils.isNotBlank(requiredBuildingHeight)) {
                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, ruleNo);
                details.put(DESCRIPTION, HEIGHT_BUILDING);
                details.put(DxfFileConstants.AREA_TYPE, typeOfArea);
                details.put(DxfFileConstants.ROAD_WIDTH, roadWidth.toString());
                details.put(PERMISSIBLE, requiredBuildingHeight);
                details.put(PROVIDED, String.valueOf(buildingHeight));
                details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }
        }
    }

    private BigDecimal getPermitedHeight(BigDecimal roadWidth, List<SetBack> setBacks) {
        BigDecimal frontYardHeight = BigDecimal.ZERO;
        for (SetBack setBack : setBacks) {
            Yard frontYard = setBack.getFrontYard();
            frontYardHeight = frontYard != null && frontYard.getMinimumDistance() != null
                    ? frontYard.getMinimumDistance()
                    : frontYardHeight;
        }

        BigDecimal sum = roadWidth.add(frontYardHeight);
        return ONE_POINTFIVE.multiply(sum).setScale(DECIMALDIGITS_MEASUREMENTS, ROUNDMODE_MEASUREMENTS);
    }

    private void validatePlinthHeight(Plan pl, HashMap<String, String> errors) {
        for (Block block : pl.getBlocks()) {

            boolean isAccepted = false;
            BigDecimal minPlinthHeight = BigDecimal.ZERO;
            String blkNo = block.getNumber();
            ScrutinyDetail scrutinyDetail = getNewScrutinyDetail("Block_" + blkNo + "_" + "Plinth");
            List<BigDecimal> plinthHeights = block.getPlinthHeight();

            if (!plinthHeights.isEmpty()) {
                minPlinthHeight = plinthHeights.stream().reduce(BigDecimal::min).get();
                if (minPlinthHeight.compareTo(BigDecimal.valueOf(0.45)) >= 0) {
                    isAccepted = true;
                }
            } else {
                String plinthHeightLayer = String.format(DxfFileConstants.LAYER_PLINTH_HEIGHT, block.getNumber());
                errors.put(plinthHeightLayer, "Plinth height is not defined in layer " + plinthHeightLayer);
                pl.addErrors(errors);
            }

            if (errors.isEmpty()) {
                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, RULE_41_I_A);
                details.put(DESCRIPTION, MIN_PLINTH_HEIGHT_DESC);
                details.put(PERMISSIBLE, MIN_PLINTH_HEIGHT);
                details.put(PROVIDED, String.valueOf(minPlinthHeight));
                details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }
        }
    }

    private void validateBasement(Plan pl, HashMap<String, String> errors) {
        for (Block block : pl.getBlocks()) {

            boolean isAccepted = false;
            String allowedBsmnt = null;
            String blkNo = block.getNumber();
            ScrutinyDetail scrutinyDetail = getNewScrutinyDetail("Block_" + blkNo + "_" + "Basement/Cellar");
            List<SetBack> setBacks = block.getSetBacks();
            List<SetBack> basementSetbacks = setBacks.stream().filter(setback -> setback.getLevel() < 0)
                    .collect(Collectors.toList());
            OccupancyTypeHelper mostRestrictiveFarHelper = pl.getVirtualBuilding() != null
                    ? pl.getVirtualBuilding().getMostRestrictiveFarHelper()
                    : null;

            if (!basementSetbacks.isEmpty()) {
                if (mostRestrictiveFarHelper != null && mostRestrictiveFarHelper.getType() != null
                        && (DxfFileConstants.A_AF.equalsIgnoreCase(mostRestrictiveFarHelper.getSubtype().getCode())
                                || DxfFileConstants.A_R
                                        .equalsIgnoreCase(mostRestrictiveFarHelper.getSubtype().getCode())
                                || DxfFileConstants.F.equalsIgnoreCase(mostRestrictiveFarHelper.getType().getCode()))
                        && pl.getPlot() != null
                        && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_300)) <= 0) {
                    isAccepted = basementSetbacks.size() <= 1 ? true : false;
                    allowedBsmnt = "1";
                } else if (mostRestrictiveFarHelper != null && mostRestrictiveFarHelper.getType() != null
                        && mostRestrictiveFarHelper.getSubtype() != null
                        && (DxfFileConstants.A_AF.equalsIgnoreCase(mostRestrictiveFarHelper.getSubtype().getCode())
                                || DxfFileConstants.A_R
                                        .equalsIgnoreCase(mostRestrictiveFarHelper.getSubtype().getCode())
                                || DxfFileConstants.F.equalsIgnoreCase(mostRestrictiveFarHelper.getType().getCode()))) {
                    isAccepted = basementSetbacks.size() <= 2 ? true : false;
                    allowedBsmnt = "2";
                }

                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, RULE_47);
                details.put(DESCRIPTION, MAX_BSMNT_CELLAR);
                details.put(PERMISSIBLE, allowedBsmnt);
                details.put(PROVIDED, String.valueOf(basementSetbacks.size()));
                details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }
        }
    }

    private void validateGreenBuildingsAndSustainability(Plan pl, HashMap<String, String> errors) {
        OccupancyTypeHelper mostRestrictiveFarHelper = pl.getVirtualBuilding() != null
                ? pl.getVirtualBuilding().getMostRestrictiveFarHelper()
                : null;
        ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.setKey("Common_Green buildings and sustainability provisions");
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        scrutinyDetail.addColumnHeading(3, REQUIRED);
        scrutinyDetail.addColumnHeading(4, PROVIDED);
        scrutinyDetail.addColumnHeading(5, STATUS);
        if (pl.getPlot() != null && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_100)) >= 0) {

            if (StringUtils.isNotBlank(pl.getPlanInformation().getProvisionsForGreenBuildingsAndSustainability())
                    && pl.getPlanInformation().getProvisionsForGreenBuildingsAndSustainability().equals("YES")) {

                if (mostRestrictiveFarHelper != null && mostRestrictiveFarHelper.getType() != null
                        && DxfFileConstants.A.equalsIgnoreCase(mostRestrictiveFarHelper.getType().getCode())) {

                    if (pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_100)) >= 0
                            && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_500)) < 0) {

                        validate1a(pl, scrutinyDetail);
                        validate2a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    } else if (pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_500)) >= 0
                            && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_1000)) < 0) {

                        validate1a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    } else if (pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_1000)) >= 0
                            && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_3000)) < 0) {

                        validate1a(pl, scrutinyDetail);
                        validate2a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    } else {

                        validate1a(pl, scrutinyDetail);
                        validate2a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    }
                } else {

                    if (pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_100)) >= 0
                            && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_500)) < 0) {

                        validate1a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    } else if (pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_500)) >= 0
                            && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_1000)) < 0) {

                        validate1a(pl, scrutinyDetail);
                        validate2a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    } else if (pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_1000)) >= 0
                            && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(PLOTAREA_3000)) < 0) {

                        validate1a(pl, scrutinyDetail);
                        validate2a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    } else {

                        validate1a(pl, scrutinyDetail);
                        validate2a(pl, scrutinyDetail);
                        validate2b(pl, scrutinyDetail);
                        validate4a(pl, scrutinyDetail);

                    }

                }

                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

            } else {
                errors.put(GREEN_BUILDINGS_AND_SUSTAINABILITY_PROVISIONS_ERROR_CODE,
                        GREEN_BUILDINGS_AND_SUSTAINABILITY_PROVISIONS_ERROR_MSG);
                pl.addErrors(errors);
            }
        }

    }

    private void validate4a(Plan pl, ScrutinyDetail scrutinyDetail) {
        if (pl.getUtility().getSegregationOfWaste() != null && !pl.getUtility().getSegregationOfWaste().isEmpty()) {
            addDetails(scrutinyDetail, "55-4-a", "Segregation of Waste", "Segregation of waste details",
                    "Provided segregation of waste details", Result.Accepted.getResultVal());
        } else {
            addDetails(scrutinyDetail, "55-4-a", "Segregation of Waste", "Segregation of waste details",
                    "Not provided segregation of waste details", Result.Not_Accepted.getResultVal());
        }
    }

    private void validate2b(Plan pl, ScrutinyDetail scrutinyDetail) {
        if (pl.getUtility().getSolarWaterHeatingSystems() != null
                && !pl.getUtility().getSolarWaterHeatingSystems().isEmpty()) {
            addDetails(scrutinyDetail, "55-2-b", "Installation of Solar Assisted Water Heating Systems",
                    "Solar assisted water heating system details",
                    "Provided solar assisted water heating system details", Result.Accepted.getResultVal());
        } else {
            addDetails(scrutinyDetail, "55-2-b", "Installation of Solar Assisted Water Heating Systems",
                    "Solar assisted water heating system details",
                    "Not provided solar assisted water heating system details", Result.Not_Accepted.getResultVal());
        }
    }

    private void validate2a(Plan pl, ScrutinyDetail scrutinyDetail) {
        if (pl.getUtility().getSolar() != null && !pl.getUtility().getSolar().isEmpty()) {
            addDetails(scrutinyDetail, "55-2-a", "Installation of Solar Photovoltaic Panels",
                    "Solar photovoltaic panel details", "Provided solar photovoltaic panel details",
                    Result.Accepted.getResultVal());
        } else {
            addDetails(scrutinyDetail, "55-2-a", "Installation of Solar Photovoltaic Panels",
                    "Solar photovoltaic panel details", "Not provided solar photovoltaic panel details",
                    Result.Not_Accepted.getResultVal());
        }
    }

    private void validate1a(Plan pl, ScrutinyDetail scrutinyDetail) {
        if (pl.getUtility().getRainWaterHarvest() != null && !pl.getUtility().getRainWaterHarvest().isEmpty()) {
            addDetails(scrutinyDetail, "55-1-a", "Rain Water Harvesting", "Rain water harvesting details",
                    "Provided rain water harvesting", Result.Accepted.getResultVal());
        } else {
            addDetails(scrutinyDetail, "55-1-a", "Rain Water Harvesting", "Rain water harvesting details",
                    "Not Provided rain water harvesting", Result.Not_Accepted.getResultVal());
        }
    }

    /*
     * private void validateIntCourtYard(Plan pl, HashMap<String, String> errors) { for (Block block : pl.getBlocks()) { boolean
     * isAccepted = false; BigDecimal minIntCourtYard = BigDecimal.ZERO; String blkNo = block.getNumber(); ScrutinyDetail
     * scrutinyDetail = getNewScrutinyDetail("Block_" + blkNo + "_" + "Interior Court Yard"); List<BigDecimal> interiorCourtYard =
     * block.getInteriorCourtYard(); if (!interiorCourtYard.isEmpty()) { minIntCourtYard =
     * interiorCourtYard.stream().reduce(BigDecimal::min).get(); if (minIntCourtYard.compareTo(BigDecimal.valueOf(0.15)) >= 0) {
     * isAccepted = true; } } if (errors.isEmpty()) { Map<String, String> details = new HashMap<>(); details.put(RULE_NO,
     * RULE_41_I_B); details.put(DESCRIPTION, MIN_INT_COURT_YARD_DESC); details.put(PERMISSIBLE, MIN_INT_COURT_YARD);
     * details.put(PROVIDED, String.valueOf(minIntCourtYard)); details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() :
     * Result.Not_Accepted.getResultVal()); scrutinyDetail.getDetail().add(details);
     * pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail); } } }
     */

    private void addDetails(ScrutinyDetail scrutinyDetail, String rule, String description, String required,
            String provided, String status) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, rule);
        details.put(DESCRIPTION, description);
        details.put(REQUIRED, required);
        details.put(PROVIDED, provided);
        details.put(STATUS, status);
        scrutinyDetail.getDetail().add(details);
    }

    private ScrutinyDetail getNewScrutinyDetailRoadArea(String key) {
        ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        scrutinyDetail.addColumnHeading(3, DxfFileConstants.AREA_TYPE);
        scrutinyDetail.addColumnHeading(4, DxfFileConstants.ROAD_WIDTH);
        scrutinyDetail.addColumnHeading(5, PERMISSIBLE);
        scrutinyDetail.addColumnHeading(6, PROVIDED);
        scrutinyDetail.addColumnHeading(7, STATUS);
        scrutinyDetail.setKey(key);
        return scrutinyDetail;
    }

    private ScrutinyDetail getNewScrutinyDetail(String key) {
        ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        scrutinyDetail.addColumnHeading(3, PERMISSIBLE);
        scrutinyDetail.addColumnHeading(4, PROVIDED);
        scrutinyDetail.addColumnHeading(5, STATUS);
        scrutinyDetail.setKey(key);
        return scrutinyDetail;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }

}
