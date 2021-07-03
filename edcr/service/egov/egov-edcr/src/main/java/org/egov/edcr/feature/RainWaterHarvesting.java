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
import java.util.Map;

import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.stereotype.Service;

@Service
public class RainWaterHarvesting extends FeatureProcess {
    private static final String RULE_51 = "51";
    /*
     * private static final String RULE_51_DESCRIPTION = "RainWater Storage Arrangement "; private static final String
     * RAINWATER_HARVESTING_TANK_CAPACITY = "Minimum capacity of Rain Water Harvesting Tank";
     */
    private static final String RULE_51_DESCRIPTION = "Rain Water Harvesting";
    // private static final String RAINWATER_HARVESTING_TANK_CAPACITY = "Minimum capacity of Rain Water Harvesting Tank";
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final String RWH_DECLARATION_ERROR = DxfFileConstants.RWH_DECLARED
            + " in PLAN_INFO layer must be declared as YES for plot area greater than 100 sqm.";

    @Override
    public Plan validate(Plan pl) {
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        HashMap<String, String> errors = new HashMap<>();

        scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        // scrutinyDetail.addColumnHeading(3, REQUIRED);
        scrutinyDetail.addColumnHeading(4, PROVIDED);
        scrutinyDetail.addColumnHeading(5, STATUS);
        scrutinyDetail.setKey("Common_Rain Water Harvesting");
        String subRule = RULE_51;
        String subRuleDesc = RULE_51_DESCRIPTION;
        // BigDecimal expectedTankCapacity = BigDecimal.ZERO;
        BigDecimal plotArea = pl.getPlot() != null ? pl.getPlot().getArea() : BigDecimal.ZERO;
        OccupancyTypeHelper mostRestrictiveFarHelper = pl.getVirtualBuilding() != null
                ? pl.getVirtualBuilding().getMostRestrictiveFarHelper()
                : null;

        if (mostRestrictiveFarHelper != null && mostRestrictiveFarHelper.getType() != null) {
            if (DxfFileConstants.A.equalsIgnoreCase(mostRestrictiveFarHelper.getType().getCode()) &&
                    plotArea.compareTo(HUNDRED) >= 0) {
                addOutput(pl, errors, subRule, subRuleDesc);
            } else if (DxfFileConstants.F.equalsIgnoreCase(mostRestrictiveFarHelper.getType().getCode())) {
                addOutput(pl, errors, subRule, subRuleDesc);
            } else if (DxfFileConstants.G.equalsIgnoreCase(mostRestrictiveFarHelper.getType().getCode())) {
                addOutput(pl, errors, subRule, subRuleDesc);
            }    
        }

        /*
         * if (plotArea.compareTo(HUNDRED) >= 0) { validateRWH(pl, errors); if (pl.getUtility() != null &&
         * !pl.getUtility().getRainWaterHarvest().isEmpty() && pl.getUtility().getRainWaterHarvestingTankCapacity() != null) {
         * Boolean valid = false; BigDecimal roundOffPlotArea = plotArea.divide(HUNDRED); expectedTankCapacity =
         * BigDecimal.valueOf(55000) .multiply(roundOffPlotArea.setScale(0, BigDecimal.ROUND_HALF_UP)); if
         * (pl.getUtility().getRainWaterHarvestingTankCapacity().compareTo(expectedTankCapacity) >= 0) { valid = true; }
         * processRWHTankCapacity(pl, "", subRule, subRuleDesc, expectedTankCapacity, valid); } }
         */
        return pl;
    }

    private void addOutput(Plan pl, HashMap<String, String> errors, String subRule, String subRuleDesc) {
        if (pl.getPlanInformation() != null &&  pl.getPlanInformation().getRwhDeclared()!= null) {
            if (pl.getPlanInformation().getRwhDeclared().equalsIgnoreCase(DcrConstants.NO)
                    || pl.getPlanInformation().getRwhDeclared().equalsIgnoreCase(DcrConstants.NA)) {
                errors.put(DxfFileConstants.RWH_DECLARED, RWH_DECLARATION_ERROR);
                pl.addErrors(errors);
                addReportOutput(pl, subRule, subRuleDesc);
            } else {
                addReportOutput(pl, subRule, subRuleDesc);
            }
        }
    }

    private void addReportOutput(Plan pl, String subRule, String subRuleDesc) {
        if (pl.getUtility() != null) {
            if (pl.getUtility().getRainWaterHarvest() != null && !pl.getUtility().getRainWaterHarvest().isEmpty()) {
                setReportOutputDetails(pl, subRule, subRuleDesc, null,
                        "Defined in the plan",
                        Result.Verify.getResultVal());
            } else {
                setReportOutputDetails(pl, subRule, subRuleDesc, null,
                        "Not Defined in the plan",
                        Result.Not_Accepted.getResultVal());
            }
        }
    }

    
    /*
     * private void processRWHTankCapacity(Plan plan, String rule, String subRule, String subRuleDesc, BigDecimal
     * expectedTankCapacity, Boolean valid) { if (expectedTankCapacity.compareTo(BigDecimal.valueOf(0)) > 0) { if (valid) {
     * setReportOutputDetails(plan, subRule, RAINWATER_HARVESTING_TANK_CAPACITY, expectedTankCapacity.toString(),
     * plan.getUtility().getRainWaterHarvestingTankCapacity().toString(), Result.Accepted.getResultVal()); } else {
     * setReportOutputDetails(plan, subRule, RAINWATER_HARVESTING_TANK_CAPACITY, expectedTankCapacity.toString() + IN_LITRE,
     * plan.getUtility().getRainWaterHarvestingTankCapacity().toString() + IN_LITRE, Result.Not_Accepted.getResultVal()); } } }
     */
     

    
    /*
     * private boolean processRWH(Plan plan, String rule, String subRule, String subRuleDesc) { if
     * (!plan.getUtility().getRainWaterHarvest().isEmpty()) { setReportOutputDetails(plan, subRule, subRuleDesc, "",
     * OBJECTDEFINED_DESC, Result.Accepted.getResultVal()); return true; } else if
     * (plan.getUtility().getRainWaterHarvest().isEmpty()) { setReportOutputDetails(plan, subRule, subRuleDesc, "",
     * OBJECTNOTDEFINED_DESC, Result.Not_Accepted.getResultVal()); return true; } return false; } private boolean
     * checkOccupancyTypeForRWH(OccupancyType occupancyType) { return occupancyType.equals(OccupancyType.OCCUPANCY_A2) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_A3) || occupancyType.equals(OccupancyType.OCCUPANCY_B1) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_B2) || occupancyType.equals(OccupancyType.OCCUPANCY_B3) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_C) || occupancyType.equals(OccupancyType.OCCUPANCY_C1) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_C2) || occupancyType.equals(OccupancyType.OCCUPANCY_C3) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_D) || occupancyType.equals(OccupancyType.OCCUPANCY_D1) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_D2) || occupancyType.equals(OccupancyType.OCCUPANCY_E) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_G1) || occupancyType.equals(OccupancyType.OCCUPANCY_G2) ||
     * occupancyType.equals(OccupancyType.OCCUPANCY_I1) || occupancyType.equals(OccupancyType.OCCUPANCY_I2); }
     */
     

    private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String expected, String actual,
            String status) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(DESCRIPTION, ruleDesc);
        // details.put(REQUIRED, expected);
        details.put(PROVIDED, actual);
        details.put(STATUS, status);
        scrutinyDetail.getDetail().add(details);
        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    /*
     * private boolean validateRWH(Plan pl, HashMap<String, String> errors) { if (pl.getUtility().getRainWaterHarvest().isEmpty())
     * { errors.put(RAINWATER_HARVESTING, edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { RAINWATER_HARVESTING },
     * LocaleContextHolder.getLocale())); pl.addErrors(errors); return true; } else if
     * (!pl.getUtility().getRainWaterHarvest().isEmpty() && pl.getUtility().getRainWaterHarvestingTankCapacity() == null) {
     * errors.put(RAINWATER_HARVES_TANKCAPACITY, edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] {
     * RAINWATER_HARVES_TANKCAPACITY }, LocaleContextHolder.getLocale())); pl.addErrors(errors); return true; } return false; }
     */

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
