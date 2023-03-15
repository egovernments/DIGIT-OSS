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
import static org.egov.edcr.constants.DxfFileConstants.F;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.RoomHeight;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.service.ProcessHelper;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.stereotype.Service;

@Service
public class Kitchen extends FeatureProcess {

    private static final String SUBRULE_41_III = "41-iii";

    private static final String SUBRULE_41_III_DESC = "Minimum height of kitchen";
    private static final String SUBRULE_41_III_AREA_DESC = "Total area of %s";
    private static final String SUBRULE_41_III_TOTAL_WIDTH = "Minimum Width of %s";

    public static final BigDecimal MINIMUM_HEIGHT_2_75 = BigDecimal.valueOf(2.75);
    public static final BigDecimal MINIMUM_HEIGHT_2_4 = BigDecimal.valueOf(2.4);
    public static final BigDecimal MINIMUM_AREA_4_5 = BigDecimal.valueOf(4.5);
    public static final BigDecimal MINIMUM_AREA_7_5 = BigDecimal.valueOf(7.5);
    public static final BigDecimal MINIMUM_AREA_5 = BigDecimal.valueOf(5);

    public static final BigDecimal MINIMUM_WIDTH_1_8 = BigDecimal.valueOf(1.8);
    public static final BigDecimal MINIMUM_WIDTH_2_1 = BigDecimal.valueOf(2.1);
    private static final String FLOOR = "Floor";
    private static final String ROOM_HEIGHT_NOTDEFINED = "Kitchen height is not defined in layer ";
    private static final String LAYER_ROOM_HEIGHT = "BLK_%s_FLR_%s_%s";
    private static final String KITCHEN = "kitchen";
    private static final String KITCHEN_STORE = "kitchen with store room";
    private static final String KITCHEN_DINING = "kitchen with dining hall";

    @Override
    public Plan validate(Plan pl) {
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        Map<String, Integer> heightOfRoomFeaturesColor = pl.getSubFeatureColorCodesMaster().get("HeightOfRoom");
        validate(pl);
        HashMap<String, String> errors = new HashMap<>();
        if (pl != null && pl.getBlocks() != null) {
            OccupancyTypeHelper mostRestrictiveOccupancy = pl.getVirtualBuilding() != null
                    ? pl.getVirtualBuilding().getMostRestrictiveFarHelper()
                    : null;
            if (mostRestrictiveOccupancy != null && mostRestrictiveOccupancy.getSubtype() != null
                    && (A.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())
                            || F.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode()))) {
                blk: for (Block block : pl.getBlocks()) {
                    if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty()) {
                        scrutinyDetail = new ScrutinyDetail();
                        scrutinyDetail.addColumnHeading(1, RULE_NO);
                        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
                        scrutinyDetail.addColumnHeading(3, FLOOR);
                        scrutinyDetail.addColumnHeading(4, REQUIRED);
                        scrutinyDetail.addColumnHeading(5, PROVIDED);
                        scrutinyDetail.addColumnHeading(6, STATUS);

                        scrutinyDetail.setKey("Block_" + block.getNumber() + "_" + "Kitchen");

                        for (Floor floor : block.getBuilding().getFloors()) {
                            List<BigDecimal> kitchenAreas = new ArrayList<>();
                            List<BigDecimal> kitchenStoreAreas = new ArrayList<>();
                            List<BigDecimal> kitchenDiningAreas = new ArrayList<>();
                            List<BigDecimal> kitchenWidths = new ArrayList<>();
                            List<BigDecimal> kitchenStoreWidths = new ArrayList<>();
                            List<BigDecimal> kitchenDiningWidths = new ArrayList<>();
                            BigDecimal minimumHeight = BigDecimal.ZERO;
                            BigDecimal totalArea = BigDecimal.ZERO;
                            BigDecimal minWidth = BigDecimal.ZERO;
                            String subRule = null;
                            String subRuleDesc = null;
                            String kitchenRoomColor = "";
                            String kitchenStoreRoomColor = "";
                            String kitchenDiningRoomColor = "";

                            if (A.equalsIgnoreCase(mostRestrictiveOccupancy.getType().getCode())) {
                                kitchenRoomColor = DxfFileConstants.RESIDENTIAL_KITCHEN_ROOM_COLOR;
                                kitchenStoreRoomColor = DxfFileConstants.RESIDENTIAL_KITCHEN_STORE_ROOM_COLOR;
                                kitchenDiningRoomColor = DxfFileConstants.RESIDENTIAL_KITCHEN_DINING_ROOM_COLOR;
                            } else {
                                kitchenRoomColor = DxfFileConstants.COMMERCIAL_KITCHEN_ROOM_COLOR;
                                kitchenStoreRoomColor = DxfFileConstants.COMMERCIAL_KITCHEN_STORE_ROOM_COLOR;
                                kitchenDiningRoomColor = DxfFileConstants.COMMERCIAL_KITCHEN_DINING_ROOM_COLOR;
                            }

                            if (floor.getKitchen() != null) {
                                List<BigDecimal> kitchenHeights = new ArrayList<>();
                                List<RoomHeight> heights = floor.getKitchen().getHeights();
                                List<Measurement> kitchenRooms = floor.getKitchen().getRooms();

                                for (RoomHeight roomHeight : heights) {
                                    kitchenHeights.add(roomHeight.getHeight());
                                }

                                for (Measurement kitchen : kitchenRooms) {
                                    if (heightOfRoomFeaturesColor.get(kitchenRoomColor) == kitchen.getColorCode()) {
                                        kitchenAreas.add(kitchen.getArea());
                                        kitchenWidths.add(kitchen.getWidth());
                                    }
                                    if (heightOfRoomFeaturesColor.get(kitchenStoreRoomColor) == kitchen.getColorCode()) {
                                        kitchenStoreAreas.add(kitchen.getArea());
                                        kitchenStoreWidths.add(kitchen.getWidth());
                                    }
                                    if (heightOfRoomFeaturesColor.get(kitchenDiningRoomColor) == kitchen.getColorCode()) {
                                        kitchenDiningAreas.add(kitchen.getArea());
                                        kitchenDiningWidths.add(kitchen.getWidth());
                                    }
                                }

                                if (!kitchenHeights.isEmpty()) {
                                    BigDecimal minHeight = kitchenHeights.stream().reduce(BigDecimal::min).get();

                                    minimumHeight = MINIMUM_HEIGHT_2_75;
                                    subRule = SUBRULE_41_III;
                                    subRuleDesc = SUBRULE_41_III_DESC;

                                    boolean valid = false;
                                    boolean isTypicalRepititiveFloor = false;
                                    Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                            isTypicalRepititiveFloor);
                                    buildResult(pl, floor, minimumHeight, subRule, subRuleDesc, minHeight, valid,
                                            typicalFloorValues);
                                } else {
                                    String layerName = String.format(LAYER_ROOM_HEIGHT, block.getNumber(), floor.getNumber(),
                                            "KITCHEN");
                                    errors.put(layerName,
                                            ROOM_HEIGHT_NOTDEFINED + layerName);
                                    pl.addErrors(errors);
                                }

                            }
                            subRule = SUBRULE_41_III;

                            if (!kitchenAreas.isEmpty()) {
                                totalArea = kitchenAreas.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                                minimumHeight = MINIMUM_AREA_5;
                                subRuleDesc = String.format(SUBRULE_41_III_AREA_DESC, KITCHEN);

                                boolean valid = false;
                                boolean isTypicalRepititiveFloor = false;
                                Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                        isTypicalRepititiveFloor);
                                buildResult(pl, floor, minimumHeight, subRule, subRuleDesc, totalArea, valid, typicalFloorValues);

                            }

                            if (!kitchenWidths.isEmpty()) {
                                boolean valid = false;
                                boolean isTypicalRepititiveFloor = false;
                                Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                        isTypicalRepititiveFloor);
                                BigDecimal minRoomWidth = kitchenWidths.stream().reduce(BigDecimal::min).get();
                                minWidth = MINIMUM_WIDTH_1_8;
                                subRuleDesc = String.format(SUBRULE_41_III_TOTAL_WIDTH, KITCHEN);
                                buildResult(pl, floor, minWidth, subRule, subRuleDesc, minRoomWidth, valid, typicalFloorValues);
                            }

                            if (!kitchenStoreAreas.isEmpty()) {
                                totalArea = kitchenStoreAreas.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                                minimumHeight = MINIMUM_AREA_4_5;
                                subRuleDesc = String.format(SUBRULE_41_III_AREA_DESC, KITCHEN_STORE);

                                boolean valid = false;
                                boolean isTypicalRepititiveFloor = false;
                                Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                        isTypicalRepititiveFloor);
                                buildResult(pl, floor, minimumHeight, subRule, subRuleDesc, totalArea, valid, typicalFloorValues);

                            }

                            if (!kitchenStoreWidths.isEmpty()) {
                                boolean valid = false;
                                boolean isTypicalRepititiveFloor = false;
                                Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                        isTypicalRepititiveFloor);
                                BigDecimal minRoomWidth = kitchenStoreWidths.stream().reduce(BigDecimal::min).get();
                                minWidth = MINIMUM_WIDTH_1_8;
                                subRuleDesc = String.format(SUBRULE_41_III_TOTAL_WIDTH, KITCHEN_STORE);
                                buildResult(pl, floor, minWidth, subRule, subRuleDesc, minRoomWidth, valid, typicalFloorValues);
                            }

                            if (!kitchenDiningAreas.isEmpty()) {
                                totalArea = kitchenDiningAreas.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                                minimumHeight = MINIMUM_AREA_7_5;
                                subRuleDesc = String.format(SUBRULE_41_III_AREA_DESC, KITCHEN_DINING);

                                boolean valid = false;
                                boolean isTypicalRepititiveFloor = false;
                                Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                        isTypicalRepititiveFloor);
                                buildResult(pl, floor, minimumHeight, subRule, subRuleDesc, totalArea, valid, typicalFloorValues);

                            }

                            if (!kitchenDiningWidths.isEmpty()) {
                                boolean valid = false;
                                boolean isTypicalRepititiveFloor = false;
                                Map<String, Object> typicalFloorValues = ProcessHelper.getTypicalFloorValues(block, floor,
                                        isTypicalRepititiveFloor);
                                BigDecimal minRoomWidth = kitchenDiningWidths.stream().reduce(BigDecimal::min).get();
                                minWidth = MINIMUM_WIDTH_2_1;
                                subRuleDesc = String.format(SUBRULE_41_III_TOTAL_WIDTH, KITCHEN_DINING);
                                buildResult(pl, floor, minWidth, subRule, subRuleDesc, minRoomWidth, valid, typicalFloorValues);
                            }
                        }
                    }
                }
            }
        }
        return pl;

    }

    private void buildResult(Plan pl, Floor floor, BigDecimal expected, String subRule, String subRuleDesc,
            BigDecimal actual, boolean valid, Map<String, Object> typicalFloorValues) {
        if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")
                && expected.compareTo(BigDecimal.valueOf(0)) > 0 &&
                subRule != null && subRuleDesc != null) {
            if (actual.compareTo(expected) >= 0) {
                valid = true;
            }
            String value = typicalFloorValues.get("typicalFloors") != null
                    ? (String) typicalFloorValues.get("typicalFloors")
                    : " floor " + floor.getNumber();
            if (valid) {
                setReportOutputDetails(pl, subRule, subRuleDesc, value,
                        expected + DcrConstants.IN_METER,
                        actual + DcrConstants.IN_METER, Result.Accepted.getResultVal());
            } else {
                setReportOutputDetails(pl, subRule, subRuleDesc, value,
                        expected + DcrConstants.IN_METER,
                        actual + DcrConstants.IN_METER, Result.Not_Accepted.getResultVal());
            }
        }
    }

    private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String floor, String expected, String actual,
            String status) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(DESCRIPTION, ruleDesc);
        details.put(FLOOR, floor);
        details.put(REQUIRED, expected);
        details.put(PROVIDED, actual);
        details.put(STATUS, status);
        scrutinyDetail.getDetail().add(details);
        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}