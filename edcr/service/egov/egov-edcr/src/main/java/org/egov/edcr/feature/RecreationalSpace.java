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

import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.RECREATIONSPACE_DESC;
import static org.egov.edcr.utility.DcrConstants.ROUNDMODE_MEASUREMENTS;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.FloorUnit;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.stereotype.Service;

@Service
public class RecreationalSpace extends FeatureProcess {

    public static final String SUB_RULE_50_DESC = "Recreational space for Residential Apartment ";
    public static final String SUB_RULE_50_DESC_CELLER = " Ground floor Recreational space ";

    public static final String SUB_RULE_50 = "50";
    public static final String SUB_RULE_50_2 = "50-2";
    public static final String RECREATION = "RECREATION";
    public static final int TOTALNUMBEROFUNITS = 12;
    public static final BigDecimal THREE = BigDecimal.valueOf(3);

    @Override
    public Plan validate(Plan pl) {/*
                                    * HashMap<String, String> errors = new HashMap<>(); for (Block block : pl.getBlocks()) {
                                    * BigDecimal totalRecreationArea = BigDecimal.ZERO; int numberOfUnitsInBlock = 0; if
                                    * (block.getBuilding() != null) { if (block.getBuilding().getFloorsAboveGround() != null &&
                                    * block.getBuilding().getFloorsAboveGround().compareTo(THREE) > 0) { if
                                    * (!block.getBuilding().getOccupancies().isEmpty() &&
                                    * checkOccupancyPresent(block.getBuilding().getOccupancies(), OccupancyType.OCCUPANCY_A4)) {
                                    * for (Floor floor : block.getBuilding().getFloors()) { for (FloorUnit unit :
                                    * floor.getUnits()) { if (OccupancyType.OCCUPANCY_A4.equals(unit.getOccupancy().getType())) {
                                    * numberOfUnitsInBlock++; } } for (Occupancy occ : floor.getOccupancies()) { if
                                    * (OccupancyType.OCCUPANCY_A4.equals(occ.getType())) { for (Measurement measure :
                                    * occ.getRecreationalSpace()) { totalRecreationArea =
                                    * totalRecreationArea.add(measure.getArea()); } } } } } if (numberOfUnitsInBlock >
                                    * TOTALNUMBEROFUNITS && totalRecreationArea.compareTo(BigDecimal.ZERO) <= 0) {
                                    * errors.put(RECREATIONSPACE_DESC, getLocaleMessage(OBJECTNOTDEFINED, RECREATIONSPACE_DESC) +
                                    * " for block " + block.getNumber()); pl.addErrors(errors); } } } }
                                    */

        return pl;
    }

    private boolean checkOccupancyPresent(List<Occupancy> occupanc, OccupancyType occupancyType) {
        for (Occupancy occ : occupanc) {
            if (occ.getType().equals(occupancyType))
                return true;
        }
        return false;
    }

    public Plan process(Plan pl) {/*
                                   * validate(pl); for (Block block : pl.getBlocks()) { scrutinyDetail = new ScrutinyDetail();
                                   * scrutinyDetail.addColumnHeading(1, RULE_NO); scrutinyDetail.addColumnHeading(2,
                                   * FIELDVERIFIED); scrutinyDetail.addColumnHeading(3, REQUIRED);
                                   * scrutinyDetail.addColumnHeading(4, PROVIDED); scrutinyDetail.addColumnHeading(5, STATUS);
                                   * scrutinyDetail.setKey("Block_" + block.getName() + "_" + "Recreational space"); BigDecimal
                                   * totalRecreationArea = BigDecimal.ZERO; BigDecimal totalRecreationAreaInGroundFloor =
                                   * BigDecimal.ZERO; BigDecimal totalFloorArea = BigDecimal.ZERO; int numberOfUnitsInBlock = 0;
                                   * if (block.getBuilding() != null && block.getBuilding().getFloorsAboveGround() != null &&
                                   * block.getBuilding().getFloorsAboveGround().compareTo(THREE) > 0) { if
                                   * (!block.getBuilding().getOccupancies().isEmpty() &&
                                   * checkOccupancyPresent(block.getBuilding().getOccupancies(), OccupancyType.OCCUPANCY_A4)) {
                                   * for (Floor floor : block.getBuilding().getFloors()) { for (FloorUnit unit : floor.getUnits())
                                   * { if (OccupancyType.OCCUPANCY_A4.equals(unit.getOccupancy().getType())) {
                                   * numberOfUnitsInBlock++; } } for (Occupancy occ : floor.getOccupancies()) { if
                                   * (OccupancyType.OCCUPANCY_A4.equals(occ.getType())) { if (occ.getFloorArea() != null) {
                                   * totalFloorArea = totalFloorArea.add(occ.getFloorArea()); } for (Measurement measure :
                                   * occ.getRecreationalSpace()) { if (floor.getNumber() == 0) { totalRecreationAreaInGroundFloor
                                   * = totalRecreationAreaInGroundFloor .add(measure.getArea()); } totalRecreationArea =
                                   * totalRecreationArea.add(measure.getArea()); } } } } } if (numberOfUnitsInBlock >
                                   * TOTALNUMBEROFUNITS && totalRecreationArea.compareTo(BigDecimal.ZERO) > 0) { double
                                   * requiredArea = (totalFloorArea.doubleValue() * 6) / 100; BigDecimal totalRecArea =
                                   * totalRecreationArea.divide(totalFloorArea, 3, ROUNDMODE_MEASUREMENTS)
                                   * .multiply(BigDecimal.valueOf(100)).setScale(3, ROUNDMODE_MEASUREMENTS); Map<String, String>
                                   * details = new HashMap<>(); details.put(RULE_NO, SUB_RULE_50_2); details.put(FIELDVERIFIED,
                                   * "Minimum 6% recreational space should be provided of total floor area");
                                   * details.put(REQUIRED, "6%"); details.put(PROVIDED, totalRecArea + "%"); if
                                   * (totalRecreationArea.doubleValue() > requiredArea) { details.put(STATUS,
                                   * Result.Accepted.getResultVal()); } else { details.put(STATUS,
                                   * Result.Not_Accepted.getResultVal()); } scrutinyDetail.getDetail().add(details); //
                                   * requiredArea = (totalFloorArea.doubleValue() * 35) / 100; Map<String, String> details1 = new
                                   * HashMap<>(); details1.put(RULE_NO, SUB_RULE_50_2); details1.put(FIELDVERIFIED,
                                   * "Minimum 35% recreational space should be provided in ground floor"); details1.put(REQUIRED,
                                   * "35%"); BigDecimal totalRecArea1 = (totalRecreationAreaInGroundFloor
                                   * .divide(BigDecimal.valueOf(requiredArea), 5, ROUNDMODE_MEASUREMENTS)
                                   * .multiply(BigDecimal.valueOf(100))) .setScale(2, ROUNDMODE_MEASUREMENTS);
                                   * details1.put(PROVIDED, totalRecArea1 + "%"); if (totalRecArea1.doubleValue() >= 35) {
                                   * details1.put(STATUS, Result.Accepted.getResultVal()); } else { details1.put(STATUS,
                                   * Result.Not_Accepted.getResultVal()); } scrutinyDetail.getDetail().add(details1);
                                   * pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail); } } }
                                   */
        return pl;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
