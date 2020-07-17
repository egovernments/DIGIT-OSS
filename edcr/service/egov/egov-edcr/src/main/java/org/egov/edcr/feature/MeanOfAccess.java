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
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.service.ProcessHelper;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class MeanOfAccess extends FeatureProcess {
    private static final Logger LOG = Logger.getLogger(MeanOfAccess.class);

    public static final BigDecimal VAL_4000 = BigDecimal.valueOf(4000);
    private static final String ACCESS_WIDTH = "Access Width";
    private static final String SUBRULE_57_5 = "57-5";
    private static final String SUBRULE_58_3b = "58-3-b";
    private static final String SUBRULE_59_4 = "59-4";
    private static final String SUB_RULE_DESCRIPTION = "Minimum access width for plan for %s";
    public static final String OCCUPANCY = "occupancy";
    private static final String SUBRULE_33_1 = "33-1";
    public static final BigDecimal VAL_300 = BigDecimal.valueOf(300);
    public static final BigDecimal VAL_600 = BigDecimal.valueOf(600);
    public static final BigDecimal VAL_1000 = BigDecimal.valueOf(1000);
    public static final BigDecimal VAL_8000 = BigDecimal.valueOf(8000);
    public static final BigDecimal VAL_18000 = BigDecimal.valueOf(18000);
    public static final BigDecimal VAL_24000 = BigDecimal.valueOf(24000);
    public static final BigDecimal VAL_1500 = BigDecimal.valueOf(1500);
    public static final BigDecimal VAL_6000 = BigDecimal.valueOf(6000);
    public static final BigDecimal VAL_12000 = BigDecimal.valueOf(12000);
    private static final String SUBRULE_116 = "116";
    private static final String SUB_RULE_DES = "Minimum access width";
    private static final String OCCPNCYCONDITION = "Occupancy/Condition";
    private static final String REMARKS = "Remarks";

    @Override
    public Plan process(Plan pl) {/*
                                   * scrutinyDetail = new ScrutinyDetail(); scrutinyDetail.setKey("Common_Access Width");
                                   * scrutinyDetail.addColumnHeading(1, RULE_NO); scrutinyDetail.addColumnHeading(2, DESCRIPTION);
                                   * scrutinyDetail.addColumnHeading(3, OCCPNCYCONDITION); scrutinyDetail.addColumnHeading(4,
                                   * REQUIRED); scrutinyDetail.addColumnHeading(5, PROVIDED); scrutinyDetail.addColumnHeading(6,
                                   * STATUS); scrutinyDetail.addColumnHeading(7, REMARKS); String rule = ACCESS_WIDTH; String
                                   * subRule = null; Boolean valid = false; boolean extemption = ProcessHelper.isSmallPlot(pl); if
                                   * (!extemption) { BigDecimal totalFloorAreaOfAllBlocks = pl.getVirtualBuilding()!= null &&
                                   * pl.getVirtualBuilding().getTotalFloorArea() == null ? BigDecimal.ZERO :
                                   * pl.getVirtualBuilding().getTotalFloorArea(); List<Map<String, Object>>
                                   * listOfOccupancyMinimumAccessWidthMap = new ArrayList<>(); if (pl.getVirtualBuilding() != null
                                   * && !pl.getVirtualBuilding().getOccupancies().isEmpty()) { if
                                   * (pl.getVirtualBuilding().getOccupancies().stream() .anyMatch(occupancyType ->
                                   * !(occupancyType.equals(OccupancyType.OCCUPANCY_B1) ||
                                   * occupancyType.equals(OccupancyType.OCCUPANCY_B2)))) { // occupancies present are other than
                                   * B1 and B2. for (OccupancyType occupancy : pl.getVirtualBuilding().getOccupancies()) { // map
                                   * of occupancy, subrule and minimum access width Map<String, Object>
                                   * occupancyMinimumAccessWidthMap = new HashMap<>(); BigDecimal minimumAccessWidth =
                                   * BigDecimal.ZERO; if (occupancy.equals(OccupancyType.OCCUPANCY_A1) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_A4) || occupancy.equals(OccupancyType.OCCUPANCY_A5))
                                   * { if (totalFloorAreaOfAllBlocks.compareTo(VAL_300) <= 0) { // dont validate access width for
                                   * single family residential with floor area <= 300 if
                                   * (occupancy.equals(OccupancyType.OCCUPANCY_A1)) break; else { minimumAccessWidth =
                                   * BigDecimal.valueOf(1.2); } } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_300) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_600) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(2); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_600) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_1000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(3); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_1000) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_4000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(3.6); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_4000) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_8000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(5); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_8000) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_18000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(6); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_18000) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_24000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(7); } else { minimumAccessWidth = BigDecimal.valueOf(10); } subRule =
                                   * SUBRULE_33_1; } else if (occupancy.equals(OccupancyType.OCCUPANCY_A2) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_A3) || occupancy.equals(OccupancyType.OCCUPANCY_B1)
                                   * || occupancy.equals(OccupancyType.OCCUPANCY_B2) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_B3) || occupancy.equals(OccupancyType.OCCUPANCY_C)
                                   * || occupancy.equals(OccupancyType.OCCUPANCY_C1) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_C2) || occupancy.equals(OccupancyType.OCCUPANCY_C3)
                                   * || occupancy.equals(OccupancyType.OCCUPANCY_D) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_D1) || occupancy.equals(OccupancyType.OCCUPANCY_D2)
                                   * || occupancy.equals(OccupancyType.OCCUPANCY_E) || occupancy.equals(OccupancyType.OCCUPANCY_F)
                                   * || occupancy.equals(OccupancyType.OCCUPANCY_F1) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_F2) || occupancy.equals(OccupancyType.OCCUPANCY_F3)
                                   * || occupancy.equals(OccupancyType.OCCUPANCY_F4)) { if
                                   * (totalFloorAreaOfAllBlocks.compareTo(VAL_300) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(1.2); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_300) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_1500) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(3.6); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_1500) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_6000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(5); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_6000) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_12000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(6); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_12000) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_18000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(7); } else { minimumAccessWidth = BigDecimal.valueOf(10); } subRule =
                                   * SUBRULE_33_1; } else if (occupancy.equals(OccupancyType.OCCUPANCY_G1) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_G2)) { if
                                   * (totalFloorAreaOfAllBlocks.compareTo(VAL_300) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(3); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_300) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_1500) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(3.6); } else if (totalFloorAreaOfAllBlocks.compareTo(VAL_1500) > 0 &&
                                   * totalFloorAreaOfAllBlocks.compareTo(VAL_6000) <= 0) { minimumAccessWidth =
                                   * BigDecimal.valueOf(5); } else { minimumAccessWidth = BigDecimal.valueOf(6); } subRule =
                                   * SUBRULE_57_5; } else if (occupancy.equals(OccupancyType.OCCUPANCY_H)) { minimumAccessWidth =
                                   * BigDecimal.valueOf(7); subRule = SUBRULE_58_3b; } else if
                                   * (occupancy.equals(OccupancyType.OCCUPANCY_I1) ||
                                   * occupancy.equals(OccupancyType.OCCUPANCY_I2)) { minimumAccessWidth = BigDecimal.valueOf(7);
                                   * subRule = SUBRULE_59_4; } occupancyMinimumAccessWidthMap.put("subRule", subRule);
                                   * occupancyMinimumAccessWidthMap.put("minAccessWidth", minimumAccessWidth);
                                   * occupancyMinimumAccessWidthMap.put(OCCUPANCY, occupancy.getOccupancyTypeVal());
                                   * listOfOccupancyMinimumAccessWidthMap.add(occupancyMinimumAccessWidthMap); } } else { //
                                   * validations for educational institutions String occupancyType =
                                   * pl.getVirtualBuilding().getOccupancies().contains(OccupancyType.OCCUPANCY_B2) ?
                                   * OccupancyType.OCCUPANCY_B2.getOccupancyTypeVal() :
                                   * OccupancyType.OCCUPANCY_B1.getOccupancyTypeVal(); if (pl.getPlanInformation() != null &&
                                   * pl.getPlanInformation().getGovernmentOrAidedSchool() != null &&
                                   * pl.getPlanInformation().getGovernmentOrAidedSchool()) { setReportOutputDetails(pl,
                                   * SUBRULE_33_1, SUB_RULE_DES, occupancyType, "", "", Result.Verify.getResultVal(),
                                   * "The existing access shall be sufficient " +
                                   * "for addition of toilet blocks and other sanitation arrangements"); } if
                                   * (pl.getPlanInformation() != null && pl.getVirtualBuilding().getTotalFloorArea() != null &&
                                   * pl.getVirtualBuilding().getTotalExistingFloorArea() != null &&
                                   * pl.getVirtualBuilding().getTotalFloorArea() .intValue() <= 5000 &&
                                   * pl.getVirtualBuilding().getTotalFloorArea().compareTo(
                                   * pl.getVirtualBuilding().getTotalExistingFloorArea()
                                   * .add(pl.getPlanInformation().getDemolitionArea())) < 0) { if
                                   * (pl.getPlanInformation().getAccessWidth() != null &&
                                   * pl.getPlanInformation().getAccessWidth().compareTo(BigDecimal.valueOf(3.6)) >= 0) { valid =
                                   * true; } if (valid) { setReportOutputDetails(pl, SUBRULE_33_1, SUB_RULE_DES, occupancyType,
                                   * String.valueOf(3.6), pl.getPlanInformation().getAccessWidth().toString(),
                                   * Result.Accepted.getResultVal(), ""); } else { setReportOutputDetails(pl, SUBRULE_33_1,
                                   * SUB_RULE_DES, occupancyType, String.valueOf(3.6),
                                   * pl.getPlanInformation().getAccessWidth().toString(), Result.Not_Accepted.getResultVal(), "");
                                   * } } } } // calculate maximum of all minimum access widths and the occupancy corresponding to
                                   * it is most restrictive Map<String, Object> maxOfMinAccessWidth = new HashMap<>(); if
                                   * (!listOfOccupancyMinimumAccessWidthMap.isEmpty()) { maxOfMinAccessWidth =
                                   * listOfOccupancyMinimumAccessWidthMap.get(0); for (Map<String, Object> mapOfAllDtls :
                                   * listOfOccupancyMinimumAccessWidthMap) { if (((BigDecimal) mapOfAllDtls.get("minAccessWidth"))
                                   * .compareTo((BigDecimal) maxOfMinAccessWidth.get("minAccessWidth")) == 0) { // if subrules are
                                   * same for any number of same minimum access width in map , show it only once, duplicates //
                                   * are not shown. // if subrules are different for any number of same minimum access width in
                                   * map, show all subrules by // comma separated. if (mapOfAllDtls.get("subRule") != null &&
                                   * !mapOfAllDtls.get("subRule").equals(maxOfMinAccessWidth.get("subRule"))) { SortedSet<String>
                                   * uniqueSubrules = new TreeSet<>(); String[] subRuleString = (mapOfAllDtls.get("subRule") +
                                   * " , " + maxOfMinAccessWidth.get("subRule")) .split(" , "); for (String str : subRuleString) {
                                   * uniqueSubrules.add(str); } String subRuleStr = removeDuplicates(uniqueSubrules);
                                   * maxOfMinAccessWidth.put("subRule", subRuleStr); } // if occupancies are same for any number
                                   * of same minimum access width in map , show it only once, // duplicates are not shown. // if
                                   * occupancies are different for any number of same minimum access width in map, show all
                                   * occupancies // by comma separated. if (mapOfAllDtls.get(OCCUPANCY) != null &&
                                   * !(mapOfAllDtls.get(OCCUPANCY)).equals(maxOfMinAccessWidth.get(OCCUPANCY))) {
                                   * SortedSet<String> uniqueOccupancies = new TreeSet<>(); String[] occupancyString =
                                   * (mapOfAllDtls.get(OCCUPANCY) + " , " + maxOfMinAccessWidth.get(OCCUPANCY)) .split(" , "); for
                                   * (String str : occupancyString) { uniqueOccupancies.add(str); } String occupancyStr =
                                   * removeDuplicates(uniqueOccupancies); maxOfMinAccessWidth.put(OCCUPANCY, occupancyStr); }
                                   * continue; } if (((BigDecimal) maxOfMinAccessWidth.get("minAccessWidth"))
                                   * .compareTo((BigDecimal) mapOfAllDtls.get("minAccessWidth")) < 0) {
                                   * maxOfMinAccessWidth.putAll(mapOfAllDtls); } } } // add height of all blocks to sorted set (in
                                   * asc order) SortedSet<BigDecimal> heightOfBlocks = new TreeSet<>(); for (Block block :
                                   * pl.getBlocks()) { if (block.getBuilding().getBuildingHeight() != null) {
                                   * heightOfBlocks.add(block.getBuilding().getBuildingHeight()); } } Map<String, Object>
                                   * mapOfHeightWiseValues = new ConcurrentHashMap<>(); Map<String, Object>
                                   * mapOfFinalAccessWidthValues = new ConcurrentHashMap<>(); List<BigDecimal> hghtOfBlks = new
                                   * ArrayList<>(heightOfBlocks); // reverse the list so that all heights will come in desc order
                                   * Collections.reverse(hghtOfBlks); // add subrule if height condition is satisfied. if
                                   * (!hghtOfBlks.isEmpty() && hghtOfBlks.get(0).compareTo(BigDecimal.valueOf(16)) > 0) {
                                   * mapOfHeightWiseValues.put("subRule", SUBRULE_116);
                                   * mapOfHeightWiseValues.put("minAccessWidth", BigDecimal.valueOf(5));
                                   * mapOfHeightWiseValues.put(OCCUPANCY, "Height Of Building Greater Than 16"); } // calculate
                                   * which access width amongst height condition or most restrictive occupancy is greater and
                                   * process rule as // per that if (!maxOfMinAccessWidth.isEmpty()) { if
                                   * (!mapOfHeightWiseValues.isEmpty()) { if (((BigDecimal)
                                   * mapOfHeightWiseValues.get("minAccessWidth")) .compareTo((BigDecimal)
                                   * maxOfMinAccessWidth.get("minAccessWidth")) > 0) { mapOfFinalAccessWidthValues =
                                   * mapOfHeightWiseValues; } else if (((BigDecimal) mapOfHeightWiseValues.get("minAccessWidth"))
                                   * .compareTo((BigDecimal) maxOfMinAccessWidth.get("minAccessWidth")) < 0) {
                                   * mapOfFinalAccessWidthValues = maxOfMinAccessWidth; } else { // if access width as per height
                                   * condition and access width for most restrictive occupancy is same // if occupancies are same
                                   * , show only once. if they are different show comma separated if
                                   * (!(mapOfHeightWiseValues.get(OCCUPANCY)).equals(maxOfMinAccessWidth.get(OCCUPANCY))) {
                                   * SortedSet<String> uniqueOccupancies = new TreeSet<>(); String[] occupancyString =
                                   * (mapOfHeightWiseValues.get(OCCUPANCY) + " , " +
                                   * maxOfMinAccessWidth.get(OCCUPANCY)).split(" , "); for (String str : occupancyString) {
                                   * uniqueOccupancies.add(str); } String occupancyStr = removeDuplicates(uniqueOccupancies);
                                   * mapOfFinalAccessWidthValues.put(OCCUPANCY, occupancyStr); } else {
                                   * mapOfFinalAccessWidthValues.put(OCCUPANCY, mapOfHeightWiseValues.get(OCCUPANCY)); }
                                   * mapOfFinalAccessWidthValues.put("minAccessWidth",
                                   * mapOfHeightWiseValues.get("minAccessWidth")); // if subrules are same , show only once. if
                                   * they are different show comma separated if
                                   * (!mapOfHeightWiseValues.get("subRule").equals(maxOfMinAccessWidth.get("subRule"))) {
                                   * SortedSet<String> uniqueSubrules = new TreeSet<>(); String[] subRuleString =
                                   * (mapOfHeightWiseValues.get("subRule") + " , " +
                                   * maxOfMinAccessWidth.get("subRule")).split(" , "); for (String str : subRuleString) {
                                   * uniqueSubrules.add(str); } String subRuleStr = removeDuplicates(uniqueSubrules);
                                   * mapOfFinalAccessWidthValues.put("subRule", subRuleStr); } else {
                                   * mapOfFinalAccessWidthValues.put("subRule", mapOfHeightWiseValues.get("subRule")); } } } else
                                   * { mapOfFinalAccessWidthValues = maxOfMinAccessWidth; } } if
                                   * (pl.getPlanInformation().getAccessWidth() != null && (BigDecimal)
                                   * mapOfFinalAccessWidthValues.get("minAccessWidth") != null) { if
                                   * (pl.getPlanInformation().getAccessWidth() .compareTo((BigDecimal)
                                   * mapOfFinalAccessWidthValues.get("minAccessWidth")) >= 0) valid = true; if (valid) {
                                   * setReportOutputDetails(pl, (String) mapOfFinalAccessWidthValues.get("subRule"), SUB_RULE_DES,
                                   * mapOfFinalAccessWidthValues.get(OCCUPANCY).toString(),
                                   * mapOfFinalAccessWidthValues.get("minAccessWidth").toString() + DcrConstants.IN_METER,
                                   * pl.getPlanInformation().getAccessWidth().toString() + DcrConstants.IN_METER,
                                   * Result.Accepted.getResultVal(), ""); } else { setReportOutputDetails(pl, (String)
                                   * mapOfFinalAccessWidthValues.get("subRule"), SUB_RULE_DES,
                                   * mapOfFinalAccessWidthValues.get(OCCUPANCY).toString(),
                                   * mapOfFinalAccessWidthValues.get("minAccessWidth").toString() + DcrConstants.IN_METER,
                                   * pl.getPlanInformation().getAccessWidth().toString() + DcrConstants.IN_METER,
                                   * Result.Not_Accepted.getResultVal(), ""); } } }
                                   */
        return pl;
    }

    public Plan validateAccessWidth(Plan pl) {
        HashMap<String, String> errors = new HashMap<>();
        if (pl.getPlanInformation() != null) {
            if (pl.getPlanInformation().getAccessWidth() == null) {
                errors.put(ACCESS_WIDTH,
                        edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
                                new String[] { ACCESS_WIDTH }, LocaleContextHolder.getLocale()));
                pl.addErrors(errors);
            }
        }
        return pl;
    }

    private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String occupancy, String expected, String actual,
            String status, String remarks) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(DESCRIPTION, ruleDesc);
        details.put(OCCPNCYCONDITION, occupancy);
        details.put(REQUIRED, expected);
        details.put(PROVIDED, actual);
        details.put(STATUS, status);
        details.put(REMARKS, remarks);
        scrutinyDetail.getDetail().add(details);
        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    private String removeDuplicates(SortedSet<String> uniqueData) {
        StringBuilder str = new StringBuilder();
        List<String> unqList = new ArrayList<>(uniqueData);
        for (String unique : unqList) {
            str.append(unique);
            if (!unique.equals(unqList.get(unqList.size() - 1))) {
                str.append(" , ");
            }
        }
        return str.toString();
    }

    @Override
    public Plan validate(Plan pl) {
        /*
         * if (!ProcessHelper.isSmallPlot(pl)) validateAccessWidth(pl);
         */
        return pl;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
