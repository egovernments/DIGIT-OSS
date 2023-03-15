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

package org.egov.edcr.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Plot;
import org.egov.common.entity.edcr.TypicalFloor;

public class ProcessHelper {

    private static final BigDecimal ONEHUNDREDFIFTY = BigDecimal.valueOf(150);
    private static final BigDecimal FIFTY = BigDecimal.valueOf(50);
    private static final BigDecimal THREEHUNDRED = BigDecimal.valueOf(300);

    public static OccupancyType getOccupancyAsPerFloorArea(OccupancyType occupancy, BigDecimal floorArea) {
        if ((OccupancyType.OCCUPANCY_B1.equals(occupancy) || OccupancyType.OCCUPANCY_B2.equals(occupancy)
                || OccupancyType.OCCUPANCY_B3.equals(occupancy))) {
            if (floorArea != null && floorArea.compareTo(ONEHUNDREDFIFTY) <= 0)
                occupancy = OccupancyType.OCCUPANCY_A2;
            else
                occupancy = OccupancyType.OCCUPANCY_B1;
        } else if ((OccupancyType.OCCUPANCY_C.equals(occupancy) || OccupancyType.OCCUPANCY_C1.equals(occupancy)
                || OccupancyType.OCCUPANCY_C2.equals(occupancy) || OccupancyType.OCCUPANCY_C3.equals(occupancy))) {
            if (floorArea != null && floorArea.compareTo(ONEHUNDREDFIFTY) <= 0)
                occupancy = OccupancyType.OCCUPANCY_F;
            else
                occupancy = OccupancyType.OCCUPANCY_C;
        } else if (floorArea != null && floorArea.compareTo(ONEHUNDREDFIFTY) <= 0
                && (OccupancyType.OCCUPANCY_D.equals(occupancy)))
            occupancy = OccupancyType.OCCUPANCY_F;
        else if ((OccupancyType.OCCUPANCY_D1.equals(occupancy) || OccupancyType.OCCUPANCY_D2.equals(occupancy)))
            occupancy = OccupancyType.OCCUPANCY_D;

        else if ((OccupancyType.OCCUPANCY_E.equals(occupancy))) {
            if (floorArea != null && floorArea.compareTo(THREEHUNDRED) <= 0)
                occupancy = OccupancyType.OCCUPANCY_F;
            else
                occupancy = OccupancyType.OCCUPANCY_E;
        } else if ((OccupancyType.OCCUPANCY_H.equals(occupancy))) {
            if (floorArea != null && floorArea.compareTo(THREEHUNDRED) <= 0)
                occupancy = OccupancyType.OCCUPANCY_F;
            else
                occupancy = OccupancyType.OCCUPANCY_H;
        } else if (OccupancyType.OCCUPANCY_A5.equals(occupancy)) {
            if (floorArea != null && floorArea.compareTo(FIFTY) <= 0)
                occupancy = OccupancyType.OCCUPANCY_A1;
            else
                occupancy = OccupancyType.OCCUPANCY_F;
        }
        return occupancy;
    }
    
    public static OccupancyType getMostRestrictiveOccupancy(List<OccupancyType> distinctOccupancyTypes) {
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_I2))
            return OccupancyType.OCCUPANCY_I2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_I1))
            return OccupancyType.OCCUPANCY_I1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_G1))
            return OccupancyType.OCCUPANCY_G1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_D))
            return OccupancyType.OCCUPANCY_D;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_B1))
            return OccupancyType.OCCUPANCY_B1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_B2))
            return OccupancyType.OCCUPANCY_B2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_B3))
            return OccupancyType.OCCUPANCY_B3;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_C))
            return OccupancyType.OCCUPANCY_C;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_D1))
            return OccupancyType.OCCUPANCY_D1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_E))
            return OccupancyType.OCCUPANCY_E;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_F))
            return OccupancyType.OCCUPANCY_F;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_A1))
            return OccupancyType.OCCUPANCY_A1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_A2))
            return OccupancyType.OCCUPANCY_A2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_A4))
            return OccupancyType.OCCUPANCY_A4;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_G2))
            return OccupancyType.OCCUPANCY_G2;
        else
            return null;
    }

    public static Map<String, Object> getTypicalFloorValues(Block block, Floor floor,
            Boolean isTypicalRepititiveFloor) {
        Map<String, Object> mapOfTypicalFloorValues = new HashMap<>();
        List<Integer> typicalFlrs = new ArrayList<>();
        String typicalFloors = null;
        Integer maxTypicalFloors;
        Integer minTypicalFloors;
        if (block.getTypicalFloor() != null) {
            for (TypicalFloor typicalFloor : block.getTypicalFloor()) {
                if (typicalFloor.getRepetitiveFloorNos().contains(floor.getNumber())) {
                    isTypicalRepititiveFloor = true;
                }
                if (typicalFloor.getModelFloorNo() == floor.getNumber()) {
                    typicalFlrs.add(floor.getNumber());
                    typicalFlrs.addAll(typicalFloor.getRepetitiveFloorNos());
                    if (!typicalFlrs.isEmpty()) {
                        maxTypicalFloors = typicalFlrs.get(0);
                        minTypicalFloors = typicalFlrs.get(0);
                        for (Integer typical : typicalFlrs) {
                            if (typical > maxTypicalFloors) {
                                maxTypicalFloors = typical;
                            }
                            if (typical < minTypicalFloors) {
                                minTypicalFloors = typical;
                            }
                        }
                        typicalFloors = "Typical Floor " + minTypicalFloors + " to " + maxTypicalFloors;

                    }
                }
            }
        }
        mapOfTypicalFloorValues.put("isTypicalRepititiveFloor", isTypicalRepititiveFloor);
        mapOfTypicalFloorValues.put("typicalFloors", typicalFloors);
        return mapOfTypicalFloorValues;
    }

    public static boolean checkExemptionConditionForBuildingParts(Block blk) {
        if (blk.getBuilding() != null && blk.getBuilding().getFloorsAboveGround() != null) {
            if (blk.getResidentialBuilding() && blk.getBuilding().getFloorsAboveGround().intValue() <= 3) {
                return true;
            }
        }
        return false;
    }

    public static boolean checkExemptionConditionForSmallPlotAtBlkLevel(Plot plot, Block blk) {
        if (plot != null && blk.getBuilding() != null && blk.getBuilding().getFloorsAboveGround() != null) {
            if (blk.getResidentialOrCommercialBuilding() && plot.getSmallPlot()
                    && blk.getBuilding().getFloorsAboveGround().intValue() <= 3) {
                return true;
            }
        }
        return false;
    }

    public static boolean isSmallPlot(Plan pl) {
        if (pl != null && !pl.getBlocks().isEmpty() && pl.getPlot() != null && pl.getVirtualBuilding() != null) {
            if (!checkAnyBlockHasFloorsGreaterThanThree(pl.getBlocks())
                    && pl.getVirtualBuilding().getResidentialOrCommercialBuilding().equals(Boolean.TRUE)
                    && pl.getPlot().getSmallPlot().equals(Boolean.TRUE)) {
                return true;
            }
        }
        return false;
    }

    public static boolean checkAnyBlockHasFloorsGreaterThanThree(List<Block> blockList) {
        boolean isBlockFloorsGreaterThanThree = false;
        if (!blockList.isEmpty()) {
            for (Block blk : blockList) {
                if (blk.getBuilding() != null && blk.getBuilding().getFloorsAboveGround() != null
                        && blk.getBuilding().getFloorsAboveGround().compareTo(BigDecimal.valueOf(3)) > 0) {
                    isBlockFloorsGreaterThanThree = true;
                    break;
                }
            }
        }
        return isBlockFloorsGreaterThanThree;
    }

}
