package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Ramp;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.Util;
import org.springframework.stereotype.Service;

@Service
public class CommonFeature extends FeatureProcess {

    private static final String FLOOR = "Floor";
    private static final String SUBRULE_48_3_DESC = "Minimum number of lifts";
    private static final String SUBRULE_42_5_V = "42-5-v";
    // private static final String SUBRULE_40A_3 = "40A(3)";
    private static final String REMARKS = "Remarks";

    @Override
    public Plan validate(Plan pl) {
        return pl;
    }

    @Override
    public Plan process(Plan plan) {
        /*
         * if (plan != null && !plan.getBlocks().isEmpty()) { blk: for (Block block : plan.getBlocks()) { scrutinyDetail = new
         * ScrutinyDetail(); scrutinyDetail.addColumnHeading(1, RULE_NO); scrutinyDetail.addColumnHeading(2, FLOOR);
         * scrutinyDetail.addColumnHeading(3, REQUIRED); scrutinyDetail.addColumnHeading(4, PROVIDED);
         * scrutinyDetail.addColumnHeading(5, STATUS); scrutinyDetail.addColumnHeading(6, REMARKS);
         * scrutinyDetail.setSubHeading(SUBRULE_48_3_DESC); scrutinyDetail.setKey("Block_" + block.getNumber() + "_" +
         * "Ramp/Lift defined on each floor"); if (block.getBuilding() != null && !block.getBuilding().getOccupancies().isEmpty()
         * && block.getBuilding().getBuildingHeight().compareTo(new BigDecimal(15)) > 0) { if
         * (Util.checkExemptionConditionForBuildingParts(block)) { continue blk; } if (!block.getBuilding().getFloors().isEmpty())
         * { flr: for (Floor floor : block.getBuilding().getFloors()) { boolean isTypicalRepititiveFloor = false; Map<String,
         * Object> typicalFloorValues = Util.getTypicalFloorValues(block, floor, isTypicalRepititiveFloor); String value =
         * typicalFloorValues.get("typicalFloors") != null ? (String) typicalFloorValues.get("typicalFloors") : " floor " +
         * floor.getNumber(); List<OccupancyType> occupancyTypeList = block.getBuilding().getOccupancies().stream() .map(occupancy
         * -> occupancy.getType()).collect(Collectors.toList()); occ: for (OccupancyType occupancyType : occupancyTypeList) { if
         * (occupancyType.equals(OccupancyType.OCCUPANCY_A4) && block.getBuilding() != null &&
         * block.getBuilding().getTotalBuitUpArea() != null &&
         * block.getBuilding().getTotalBuitUpArea().compareTo(BigDecimal.valueOf(2500)) > 0) { Boolean flagRampFloor =
         * checkRampDefinedOrNot(floor); if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) { if
         * (flagRampFloor.equals(Boolean.FALSE) && !floor.getLifts().isEmpty()) { processRule42_5_V_Accepted(block, floor, plan,
         * value); break flr; } else if (flagRampFloor.equals(Boolean.FALSE) && floor.getLifts().isEmpty()) {
         * processRule42_5_V_NotAccepted(block, floor, plan, value); break flr; } else { processRule42_5_V_Accepted(block, floor,
         * plan, value); break flr; } } } else if ((occupancyType.equals(OccupancyType.OCCUPANCY_A2) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_A3) || occupancyType.equals(OccupancyType.OCCUPANCY_B1) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_B2) || occupancyType.equals(OccupancyType.OCCUPANCY_B3) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_C) || occupancyType.equals(OccupancyType.OCCUPANCY_C1) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_C2) || occupancyType.equals(OccupancyType.OCCUPANCY_C3) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_D) || occupancyType.equals(OccupancyType.OCCUPANCY_D1) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_D2) || occupancyType.equals(OccupancyType.OCCUPANCY_E) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_F) || occupancyType.equals(OccupancyType.OCCUPANCY_F1) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_F2) || occupancyType.equals(OccupancyType.OCCUPANCY_F3) ||
         * occupancyType.equals(OccupancyType.OCCUPANCY_F4)) && block.getBuilding() != null &&
         * block.getBuilding().getTotalBuitUpArea() != null &&
         * block.getBuilding().getTotalBuitUpArea().compareTo(BigDecimal.valueOf(1000)) > 0) { Boolean flagRampFloor =
         * checkRampDefinedOrNot(floor); if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) { if
         * (flagRampFloor.equals(Boolean.FALSE) && !floor.getLifts().isEmpty()) { processRule48_3_Accepted(block, floor, plan,
         * value); break occ; } else if (flagRampFloor.equals(Boolean.FALSE) && floor.getLifts().isEmpty()) {
         * processRule48_3_NotAccepted(block, floor, plan, value); break occ; } } } } } } } } }
         */return plan;

    }

    private void processRule42_5_V_NotAccepted(Block block, Floor floor, Plan plan, String value) {
        setReportOutputDetails(plan, SUBRULE_42_5_V, value, String.valueOf(1),
                String.valueOf(0),
                Result.Not_Accepted.getResultVal(), "Lift or ramp not defined on this floor");
    }

    private void processRule42_5_V_Accepted(Block block, Floor floor, Plan plan, String value) {
        setReportOutputDetails(plan, SUBRULE_42_5_V, value, String.valueOf(1),
                String.valueOf(floor.getLifts().size()),
                Result.Accepted.getResultVal(), "Lift required as ramp not defined on this floor");
    }

    private Boolean checkRampDefinedOrNot(Floor floor) {
        Boolean flagRampFloor = false;
        if (!floor.getRamps().isEmpty()) {
            for (Ramp ramp : floor.getRamps()) {
                if (/* ramp.getSlope() != null && ramp.getSlope().compareTo(BigDecimal.valueOf(0.1)) <= 0 */
                ramp != null) {
                    flagRampFloor = true;
                    break;
                }
            }
        }
        return flagRampFloor;
    }

    private void setReportOutputDetails(Plan plan, String ruleNo, String floor, String expected, String actual, String status,
            String remarks) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(FLOOR, floor);
        details.put(REQUIRED, expected);
        details.put(PROVIDED, actual);
        details.put(STATUS, status);
        details.put(REMARKS, remarks);
        scrutinyDetail.getDetail().add(details);
        plan.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
