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

import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_CULDESAC;
import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_LANE;
import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_LEACHPIT_TO_PLOT_BNDRY;
import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_NONNOTIFIEDROAD;
import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_NOTIFIEDROAD;
import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_WELLTOBOUNDARY;
import static org.egov.edcr.constants.DxfFileConstants.COLOUR_CODE_WELLTOLEACHPIT;
import static org.egov.edcr.utility.DcrConstants.IN_METER;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.WELL_DISTANCE_FROMBOUNDARY;
import static org.egov.edcr.utility.DcrConstants.WELL_ERROR_COLOUR_CODE_DISTANCE_FROMROAD;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.RoadOutput;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class Well extends FeatureProcess {

    private static final String SUB_RULE_104_4_PLOT_DESCRIPTION = "Minimum distance from waste treatment facility like: leach pit,soak pit etc to nearest point on the plot boundary";
    private static final String WELL_DISTANCE_FROM_ROAD = "Minimum distance from well to road";
    private static final String SUB_RULE_104_1_DESCRIPTION = "Open well: Minimum distance between street boundary and the well ";
    private static final String SUB_RULE_104_2_DESCRIPTION = "Minimum distance from well to nearest point on plot boundary";
    private static final String SUB_RULE_104_4_DESCRIPTION = "Minimum distance from well to nearest point on leach pit, soak pit, refuse pit, earth closet or septic tanks ";

    private static final String SUB_RULE_104_1 = "104-1";
    private static final String SUB_RULE_104_2 = "104-2";
    private static final String SUB_RULE_104_4 = "104-4";

    private static final BigDecimal three = BigDecimal.valueOf(3);
    private static final BigDecimal TWO_MTR = BigDecimal.valueOf(2);
    private static final BigDecimal ONE_ANDHALF_MTR = BigDecimal.valueOf(1.5);

    @Override
    public Plan validate(Plan pl) {/*
                                    * HashMap<String, String> errors = new HashMap<>(); if (pl != null && pl.getUtility() != null)
                                    * { if (!pl.getUtility().getWells().isEmpty()) { if
                                    * (!pl.getUtility().getWasteDisposalUnits().isEmpty()) { if
                                    * (pl.getUtility().getWells().get(0).getType() != null &&
                                    * pl.getUtility().getWasteDisposalUnits().get(0).getType() != null) { if
                                    * (pl.getUtility().getWells().get(0).getType() != null &&
                                    * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.PROPOSED) &&
                                    * pl.getUtility().getWasteDisposalUnits().get(0).getType().equals(DcrConstants.PROPOSED)) { if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(7)))) { errors.put(SUB_RULE_104_2_DESCRIPTION,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { SUB_RULE_104_2_DESCRIPTION },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(8)))) { errors.put(SUB_RULE_104_4_DESCRIPTION,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { SUB_RULE_104_4_DESCRIPTION },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(9)))) {
                                    * errors.put(SUB_RULE_104_4_PLOT_DESCRIPTION, edcrMessageSource.getMessage(OBJECTNOTDEFINED,
                                    * new String[] { SUB_RULE_104_4_PLOT_DESCRIPTION }, LocaleContextHolder.getLocale()));
                                    * pl.addErrors(errors); } if (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput
                                    * -> roadOutput.colourCode.equals(String.valueOf(1)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(2)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(5)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(6)))) { errors.put(WELL_DISTANCE_FROM_ROAD,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { WELL_DISTANCE_FROM_ROAD },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } } else if
                                    * (pl.getUtility().getWells().get(0).getType() != null &&
                                    * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.PROPOSED) &&
                                    * pl.getUtility().getWasteDisposalUnits().get(0).getType().equals(DcrConstants.EXISTING)) { if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(7)))) { errors.put(SUB_RULE_104_2_DESCRIPTION,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { SUB_RULE_104_2_DESCRIPTION },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(8)))) { errors.put(SUB_RULE_104_4_DESCRIPTION,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { SUB_RULE_104_4_DESCRIPTION },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(1)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(2)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(5)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(6)))) { errors.put(WELL_DISTANCE_FROM_ROAD,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { WELL_DISTANCE_FROM_ROAD },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } } else if
                                    * (pl.getUtility().getWells().get(0).getType() != null &&
                                    * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.EXISTING) &&
                                    * pl.getUtility().getWasteDisposalUnits().get(0).getType().equals(DcrConstants.PROPOSED)) { if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(8)))) { errors.put(SUB_RULE_104_4_DESCRIPTION,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { SUB_RULE_104_4_DESCRIPTION },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(9)))) {
                                    * errors.put(SUB_RULE_104_4_PLOT_DESCRIPTION, edcrMessageSource.getMessage(OBJECTNOTDEFINED,
                                    * new String[] { SUB_RULE_104_4_PLOT_DESCRIPTION }, LocaleContextHolder.getLocale()));
                                    * pl.addErrors(errors); } } } } else { if (pl.getUtility().getWells().get(0).getType() != null
                                    * && pl.getUtility().getWells().get(0).getType().equals(DcrConstants.PROPOSED)) { if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(7)))) { errors.put(SUB_RULE_104_2_DESCRIPTION,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { SUB_RULE_104_2_DESCRIPTION },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } if
                                    * (pl.getUtility().getWellDistance().stream() .noneMatch(roadOutput ->
                                    * roadOutput.colourCode.equals(String.valueOf(1)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(2)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(5)) ||
                                    * roadOutput.colourCode.equals(String.valueOf(6)))) { errors.put(WELL_DISTANCE_FROM_ROAD,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { WELL_DISTANCE_FROM_ROAD },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); } } } } }
                                    */
        return pl;
    }

    @Override
    public Plan process(Plan pl) {/*
                                   * validate(pl); scrutinyDetail = new ScrutinyDetail(); scrutinyDetail.addColumnHeading(1,
                                   * RULE_NO); scrutinyDetail.addColumnHeading(2, DESCRIPTION); scrutinyDetail.addColumnHeading(3,
                                   * REQUIRED); scrutinyDetail.addColumnHeading(4, PROVIDED); scrutinyDetail.addColumnHeading(5,
                                   * STATUS); scrutinyDetail.setKey("Common_Well"); if (!pl.getUtility().getWells().isEmpty()) {
                                   * if (!pl.getUtility().getWasteDisposalUnits().isEmpty()) { if
                                   * (pl.getUtility().getWells().get(0).getType() != null &&
                                   * pl.getUtility().getWasteDisposalUnits().get(0).getType() != null) { if
                                   * (pl.getUtility().getWells().get(0).getType() != null &&
                                   * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.PROPOSED) &&
                                   * pl.getUtility().getWasteDisposalUnits().get(0).getType().equals(DcrConstants.PROPOSED)) {
                                   * printOutputForProposedWellAndProposedWasteDisposal(pl); } else if
                                   * (pl.getUtility().getWells().get(0).getType() != null &&
                                   * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.PROPOSED) &&
                                   * pl.getUtility().getWasteDisposalUnits().get(0).getType().equals(DcrConstants.EXISTING)) {
                                   * printOutputForProposedWellAndExistingWasteDisposal(pl); } else if
                                   * (pl.getUtility().getWells().get(0).getType() != null &&
                                   * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.EXISTING) &&
                                   * pl.getUtility().getWasteDisposalUnits().get(0).getType().equals(DcrConstants.PROPOSED)) {
                                   * printOutputForExistingWellAndProposedWasteDisposal(pl); } } } else { if
                                   * (pl.getUtility().getWells().get(0).getType() != null &&
                                   * pl.getUtility().getWells().get(0).getType().equals(DcrConstants.PROPOSED)) {
                                   * printOutputForProposedWellWithNoWasteDisposalDefined(pl); } } }
                                   */
        return pl;
    }

    private void printOutputForProposedWellWithNoWasteDisposalDefined(Plan pl) {
        String subRule = null;
        String subRuleDesc = null;
        boolean valid = false;
        for (RoadOutput roadOutput : pl.getUtility().getWellDistance()) {

            BigDecimal minimumDistance = BigDecimal.ZERO;
            if (checkConditionForNotifiedNonNotifiedRoad(roadOutput)) {
                minimumDistance = three;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForCuldesacRoad(roadOutput)) {
                minimumDistance = TWO_MTR;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForLane(roadOutput)) {
                minimumDistance = ONE_ANDHALF_MTR;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForBoundary(roadOutput)) {
                subRule = SUB_RULE_104_2;
                subRuleDesc = SUB_RULE_104_2_DESCRIPTION;
                minimumDistance = ONE_ANDHALF_MTR;
            } else
                continue;
            printReportOutput(pl, subRule, subRuleDesc, valid, roadOutput, minimumDistance);
        }
    }

    private void printOutputForExistingWellAndProposedWasteDisposal(Plan pl) {
        String subRule = null;
        String subRuleDesc = null;
        boolean valid = false;
        for (RoadOutput roadOutput : pl.getUtility().getWellDistance()) {

            BigDecimal minimumDistance = BigDecimal.ZERO;
            if (checkConditionForWellToLeachPit(roadOutput)) {
                subRule = SUB_RULE_104_4;
                subRuleDesc = SUB_RULE_104_4_DESCRIPTION;
                minimumDistance = BigDecimal.valueOf(7.5);
            } else if (checkConditionForLeachPitToBoundary(roadOutput)) {
                subRule = SUB_RULE_104_4;
                subRuleDesc = SUB_RULE_104_4_PLOT_DESCRIPTION;
                minimumDistance = BigDecimal.valueOf(1.2);
            } else
                continue;
            printReportOutput(pl, subRule, subRuleDesc, valid, roadOutput, minimumDistance);

        }
    }

    private void printOutputForProposedWellAndExistingWasteDisposal(Plan pl) {
        String subRule = null;
        String subRuleDesc = null;
        boolean valid = false;
        for (RoadOutput roadOutput : pl.getUtility().getWellDistance()) {

            BigDecimal minimumDistance = BigDecimal.ZERO;
            if (checkConditionForNotifiedNonNotifiedRoad(roadOutput)) {
                minimumDistance = three;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForCuldesacRoad(roadOutput)) {
                minimumDistance = TWO_MTR;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForLane(roadOutput)) {
                minimumDistance = ONE_ANDHALF_MTR;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForBoundary(roadOutput)) {
                subRule = SUB_RULE_104_2;
                subRuleDesc = SUB_RULE_104_2_DESCRIPTION;
                minimumDistance = ONE_ANDHALF_MTR;
            } else if (checkConditionForWellToLeachPit(roadOutput)) {
                subRule = SUB_RULE_104_4;
                subRuleDesc = SUB_RULE_104_4_DESCRIPTION;
                minimumDistance = BigDecimal.valueOf(7.5);
            } else
                continue;
            printReportOutput(pl, subRule, subRuleDesc, valid, roadOutput, minimumDistance);
        }
    }

    private void printOutputForProposedWellAndProposedWasteDisposal(Plan pl) {
        String subRule = null;
        String subRuleDesc = null;
        boolean valid = false;
        for (RoadOutput roadOutput : pl.getUtility().getWellDistance()) {

            BigDecimal minimumDistance = BigDecimal.ZERO;
            if (checkConditionForNotifiedNonNotifiedRoad(roadOutput)) {
                minimumDistance = three;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForCuldesacRoad(roadOutput)) {
                minimumDistance = TWO_MTR;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForLane(roadOutput)) {
                minimumDistance = ONE_ANDHALF_MTR;
                subRule = SUB_RULE_104_1;
                subRuleDesc = SUB_RULE_104_1_DESCRIPTION;
            } else if (checkConditionForBoundary(roadOutput)) {
                subRule = SUB_RULE_104_2;
                subRuleDesc = SUB_RULE_104_2_DESCRIPTION;
                minimumDistance = ONE_ANDHALF_MTR;
            } else if (checkConditionForWellToLeachPit(roadOutput)) {
                subRule = SUB_RULE_104_4;
                subRuleDesc = SUB_RULE_104_4_DESCRIPTION;
                minimumDistance = BigDecimal.valueOf(7.5);
            } else if (checkConditionForLeachPitToBoundary(roadOutput)) {
                subRule = SUB_RULE_104_4;
                subRuleDesc = SUB_RULE_104_4_PLOT_DESCRIPTION;
                minimumDistance = BigDecimal.valueOf(1.2);
            } else
                continue;
            printReportOutput(pl, subRule, subRuleDesc, valid, roadOutput, minimumDistance);

        }
    }

    private void printReportOutput(Plan pl, String subRule, String subRuleDesc, boolean valid, RoadOutput roadOutput,
            BigDecimal minimumDistance) {
        HashMap<String, String> errors = new HashMap<>();
        if (minimumDistance.compareTo(BigDecimal.ZERO) == 0) {
            errors.put(WELL_DISTANCE_FROMBOUNDARY,
                    getLocaleMessage(WELL_ERROR_COLOUR_CODE_DISTANCE_FROMROAD,
                            roadOutput.distance != null ? roadOutput.distance.toString()
                                    : ""));
            pl.addErrors(errors);
        } else {
            if (roadOutput.distance != null &&
                    roadOutput.distance.compareTo(BigDecimal.ZERO) > 0
                    && roadOutput.distance.compareTo(minimumDistance) >= 0)
                valid = true;
            if (valid) {
                setReportOutputDetailsWithoutOccupancy(pl, subRule, subRuleDesc, minimumDistance.toString() + IN_METER,
                        roadOutput.distance + IN_METER, Result.Accepted.getResultVal());
            } else {
                setReportOutputDetailsWithoutOccupancy(pl, subRule, subRuleDesc, minimumDistance.toString() + IN_METER,
                        roadOutput.distance + IN_METER, Result.Not_Accepted.getResultVal());
            }
        }

    }

    private boolean checkConditionForLeachPitToBoundary(RoadOutput roadOutput) {
        return Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_LEACHPIT_TO_PLOT_BNDRY;
    }

    private boolean checkConditionForWellToLeachPit(RoadOutput roadOutput) {
        return Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_WELLTOLEACHPIT;
    }

    private boolean checkConditionForBoundary(RoadOutput roadOutput) {
        return Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_WELLTOBOUNDARY;
    }

    private boolean checkConditionForLane(RoadOutput roadOutput) {
        return Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_LANE;
    }

    private boolean checkConditionForCuldesacRoad(RoadOutput roadOutput) {
        return Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_CULDESAC;
    }

    private boolean checkConditionForNotifiedNonNotifiedRoad(RoadOutput roadOutput) {
        return Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_NOTIFIEDROAD ||
                Integer.valueOf(roadOutput.colourCode) == COLOUR_CODE_NONNOTIFIEDROAD;
    }

    private void setReportOutputDetailsWithoutOccupancy(Plan pl, String ruleNo, String ruleDesc, String expected, String actual,
            String status) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(DESCRIPTION, ruleDesc);
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
