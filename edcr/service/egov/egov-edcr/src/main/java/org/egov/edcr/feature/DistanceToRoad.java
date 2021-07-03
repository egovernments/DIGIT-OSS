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

import static org.egov.edcr.utility.DcrConstants.CULDESAC_ROAD;
import static org.egov.edcr.utility.DcrConstants.CULDESAC_SHORTESTDISTINCTTOROADFROMCENTER;
import static org.egov.edcr.utility.DcrConstants.CULD_SAC_SHORTESTDISTINCTTOROAD;
import static org.egov.edcr.utility.DcrConstants.LANE_ROAD;
import static org.egov.edcr.utility.DcrConstants.LANE_SHORTESTDISTINCTTOROAD;
import static org.egov.edcr.utility.DcrConstants.LANE_SHORTESTDISTINCTTOROADFROMCENTER;
import static org.egov.edcr.utility.DcrConstants.NONNOTIFIED_ROAD;
import static org.egov.edcr.utility.DcrConstants.NONNOTIFIED_SHORTESTDISTINCTTOROAD;
import static org.egov.edcr.utility.DcrConstants.NONNOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER;
import static org.egov.edcr.utility.DcrConstants.NOTIFIED_ROAD;
import static org.egov.edcr.utility.DcrConstants.NOTIFIED_SHORTESTDISTINCTTOROAD;
import static org.egov.edcr.utility.DcrConstants.NOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.CulDeSacRoad;
import org.egov.common.entity.edcr.Lane;
import org.egov.common.entity.edcr.NonNotifiedRoad;
import org.egov.common.entity.edcr.NotifiedRoad;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.service.ProcessHelper;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.stereotype.Service;

@Service
public class DistanceToRoad extends FeatureProcess {
    private static final String SUB_RULE_25_1 = "25-1";
    private static final String SUB_RULE_25_1_PROVISIO = "25-1 Provisio";
    private static final String SUB_RULE_25_1_PROVISIO_DESC = "Distance from building to street boundary";
    private static final String SUB_RULE_26_DESCRIPTION = "Prohibition for constructions abutting public roads.";
    private static final String SUB_RULE_62_1DESCRIPTION = "Minimum distance between plot boundary and abutting Street.";
    private static final String SUB_RULE_26 = "26";
    private static final String RULE_62 = "62";
    private static final String SUB_RULE_62_1 = "62-1";
    private static BigDecimal FIVE = BigDecimal.valueOf(5);
    private static BigDecimal THREE = BigDecimal.valueOf(3);
    private static BigDecimal SEVEN = BigDecimal.valueOf(7);
    private static BigDecimal TWO = BigDecimal.valueOf(2);
    private static BigDecimal ONEPOINTFIVE = BigDecimal.valueOf(1.5);
    private static final String RULE_EXPECTED_KEY = "meanofaccess.expected";
    private static final String RULE_ACTUAL_KEY = "meanofaccess.actual";

    @Override
    public Plan validate(Plan pl) {/*
                                    * HashMap<String, String> errors = new HashMap<>(); boolean shortestDistanceDefined = false;
                                    * if ((pl.getNotifiedRoads().isEmpty() && pl.getCuldeSacRoads().isEmpty() &&
                                    * pl.getLaneRoads().isEmpty() && pl.getNonNotifiedRoads().isEmpty())) {
                                    * errors.put(DcrConstants.ROAD, getLocaleMessage(DcrConstants.OBJECTNOTDEFINED,
                                    * DcrConstants.ROAD)); pl.addErrors(errors); } if (!pl.getNotifiedRoads().isEmpty()) for
                                    * (NotifiedRoad notifiedRoad : pl.getNotifiedRoads()) { for (BigDecimal shortestDistanceToRoad
                                    * : notifiedRoad.getShortestDistanceToRoad()) { if
                                    * (shortestDistanceToRoad.compareTo(BigDecimal.ZERO) > 0) { shortestDistanceDefined = true;
                                    * continue; } } } if (!pl.getNonNotifiedRoads().isEmpty()) for (NonNotifiedRoad
                                    * nonNotifiedRoad : pl.getNonNotifiedRoads()) { for (BigDecimal shortestDistanceToRoad :
                                    * nonNotifiedRoad.getShortestDistanceToRoad()) if
                                    * (shortestDistanceToRoad.compareTo(BigDecimal.ZERO) > 0) { shortestDistanceDefined = true;
                                    * continue; } } if (!pl.getLaneRoads().isEmpty()) for (Lane laneRoad : pl.getLaneRoads()) {
                                    * for (BigDecimal shortestDistanceToRoad : laneRoad.getShortestDistanceToRoad()) if
                                    * (shortestDistanceToRoad.compareTo(BigDecimal.ZERO) > 0) { shortestDistanceDefined = true;
                                    * continue; } } if (!pl.getCuldeSacRoads().isEmpty()) for (CulDeSacRoad culdSac :
                                    * pl.getCuldeSacRoads()) { for (BigDecimal shortestDistanceToRoad :
                                    * culdSac.getShortestDistanceToRoad()) if (shortestDistanceToRoad.compareTo(BigDecimal.ZERO) >
                                    * 0) { shortestDistanceDefined = true; continue; } } if (!shortestDistanceDefined) {
                                    * errors.put(DcrConstants.SHORTESTDISTINCTTOROAD,
                                    * getLocaleMessage(DcrConstants.OBJECTNOTDEFINED, DcrConstants.SHORTESTDISTINCTTOROAD));
                                    * pl.addErrors(errors); } // Distance from center of road mandatory if road defined. For
                                    * building not more than 3 floor, with less than or equal to 125 plot area, occupancy either
                                    * residential or commercial are exempted from "Distance from center road" check if
                                    * (!ProcessHelper.isSmallPlot(pl)) { if (!pl.getNotifiedRoads().isEmpty() &&
                                    * pl.getNotifiedRoads().get(0).getDistancesFromCenterToPlot().isEmpty()) {
                                    * errors.put(DcrConstants.NOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER,
                                    * getLocaleMessage(OBJECTNOTDEFINED, DcrConstants.NOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER));
                                    * pl.addErrors(errors); } if (!pl.getNonNotifiedRoads().isEmpty() &&
                                    * pl.getNonNotifiedRoads().get(0).getDistancesFromCenterToPlot().isEmpty()) {
                                    * errors.put(DcrConstants.NONNOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER,
                                    * getLocaleMessage(OBJECTNOTDEFINED,
                                    * DcrConstants.NONNOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER)); pl.addErrors(errors); }
                                    * BigDecimal minimumHeightOfBuilding = BigDecimal.ZERO; for (Block block : pl.getBlocks()) {
                                    * if (minimumHeightOfBuilding.compareTo(BigDecimal.ZERO) == 0 ||
                                    * block.getBuilding().getBuildingHeight().compareTo(minimumHeightOfBuilding) < 0) {
                                    * minimumHeightOfBuilding = block.getBuilding().getBuildingHeight(); } } if
                                    * (minimumHeightOfBuilding != null && minimumHeightOfBuilding.compareTo(BigDecimal.valueOf(7))
                                    * > 0) { if (!pl.getCuldeSacRoads().isEmpty() &&
                                    * pl.getCuldeSacRoads().get(0).getDistancesFromCenterToPlot().isEmpty()) {
                                    * errors.put(DcrConstants.CULDESAC_SHORTESTDISTINCTTOROADFROMCENTER,
                                    * getLocaleMessage(OBJECTNOTDEFINED, DcrConstants.CULDESAC_SHORTESTDISTINCTTOROADFROMCENTER));
                                    * pl.addErrors(errors); } if (!pl.getLaneRoads().isEmpty() &&
                                    * pl.getLaneRoads().get(0).getDistancesFromCenterToPlot().isEmpty()) {
                                    * errors.put(DcrConstants.LANE_SHORTESTDISTINCTTOROADFROMCENTER,
                                    * getLocaleMessage(OBJECTNOTDEFINED, DcrConstants.LANE_SHORTESTDISTINCTTOROADFROMCENTER));
                                    * pl.addErrors(errors); } } }
                                    */
        return pl;
    }

    @Override
    public Plan process(Plan pl) {/*
                                   * validate(pl); BigDecimal exptectedDistance; scrutinyDetail = new ScrutinyDetail();
                                   * scrutinyDetail.setKey("Common_Distance to Road"); // detail.setHeading("Distance to Road");
                                   * scrutinyDetail.addColumnHeading(1, RULE_NO); scrutinyDetail.addColumnHeading(2, DESCRIPTION);
                                   * scrutinyDetail.addColumnHeading(3, REQUIRED); scrutinyDetail.addColumnHeading(4, PROVIDED);
                                   * scrutinyDetail.addColumnHeading(5, STATUS); BigDecimal minimumHeightOfBuilding =
                                   * BigDecimal.ZERO; for (Block block : pl.getBlocks()) { if
                                   * (minimumHeightOfBuilding.compareTo(BigDecimal.ZERO) == 0 ||
                                   * block.getBuilding().getBuildingHeight().compareTo(minimumHeightOfBuilding) < 0) {
                                   * minimumHeightOfBuilding = block.getBuilding().getBuildingHeight(); } } // validating minimum
                                   * distance in notified roads minimum 5m if (pl.getNotifiedRoads() != null &&
                                   * !pl.getNotifiedRoads().isEmpty()) { exptectedDistance = FIVE; if
                                   * (!ProcessHelper.isSmallPlot(pl)) { if
                                   * (pl.getNotifiedRoads().get(0).getDistancesFromCenterToPlot() != null &&
                                   * !pl.getNotifiedRoads().get(0).getDistancesFromCenterToPlot().isEmpty())
                                   * checkBuildingDistanceFromRoad(pl, exptectedDistance,
                                   * pl.getNotifiedRoads().get(0).getDistancesFromCenterToPlot(),
                                   * NOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER, SUB_RULE_25_1, SUB_RULE_25_1,
                                   * NOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER);// SUB_RULE_25_1_DESCRIPTION } if
                                   * (pl.getNotifiedRoads().get(0).getShortestDistanceToRoad() != null &&
                                   * !pl.getNotifiedRoads().get(0).getShortestDistanceToRoad().isEmpty()) {
                                   * checkBuildingDistanceFromRoad(pl, THREE,
                                   * pl.getNotifiedRoads().get(0).getShortestDistanceToRoad(), NOTIFIED_SHORTESTDISTINCTTOROAD,
                                   * SUB_RULE_26, SUB_RULE_26, NOTIFIED_ROAD + SUB_RULE_26_DESCRIPTION); } } // validating minimum
                                   * distance in non-notified roads minimum 5m if (pl.getNonNotifiedRoads() != null &&
                                   * !pl.getNonNotifiedRoads().isEmpty()) { exptectedDistance = FIVE; if
                                   * (!ProcessHelper.isSmallPlot(pl)) { if
                                   * (pl.getNonNotifiedRoads().get(0).getDistancesFromCenterToPlot() != null &&
                                   * !pl.getNonNotifiedRoads().get(0).getDistancesFromCenterToPlot().isEmpty())
                                   * checkBuildingDistanceFromRoad(pl, exptectedDistance,
                                   * pl.getNonNotifiedRoads().get(0).getDistancesFromCenterToPlot(),
                                   * NONNOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER, SUB_RULE_25_1, SUB_RULE_25_1,
                                   * NONNOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER); } if
                                   * (pl.getNonNotifiedRoads().get(0).getShortestDistanceToRoad() != null &&
                                   * !pl.getNonNotifiedRoads().get(0).getShortestDistanceToRoad().isEmpty()) { if
                                   * (ProcessHelper.isSmallPlot(pl)) { checkBuildingDistanceFromRoad(pl, TWO,
                                   * pl.getNonNotifiedRoads().get(0).getShortestDistanceToRoad(),
                                   * NONNOTIFIED_SHORTESTDISTINCTTOROAD, RULE_62, SUB_RULE_62_1, SUB_RULE_62_1DESCRIPTION); } else
                                   * checkBuildingDistanceFromRoad(pl, THREE,
                                   * pl.getNonNotifiedRoads().get(0).getShortestDistanceToRoad(),
                                   * NONNOTIFIED_SHORTESTDISTINCTTOROAD, SUB_RULE_25_1, SUB_RULE_25_1, NONNOTIFIED_ROAD +
                                   * SUB_RULE_25_1_PROVISIO_DESC); } } // validating minimum distance in culd_sac_road minimum 2
                                   * or 3 based on height of building if (pl.getCuldeSacRoads() != null &&
                                   * !pl.getCuldeSacRoads().isEmpty()) { if (ProcessHelper.isSmallPlot(pl)) { exptectedDistance =
                                   * TWO; } else { if (minimumHeightOfBuilding.compareTo(SEVEN) <= 0) exptectedDistance = TWO;
                                   * else exptectedDistance = THREE; } if
                                   * (pl.getCuldeSacRoads().get(0).getShortestDistanceToRoad() != null &&
                                   * !pl.getCuldeSacRoads().get(0).getShortestDistanceToRoad().isEmpty())
                                   * checkBuildingDistanceFromRoad(pl, exptectedDistance,
                                   * pl.getCuldeSacRoads().get(0).getShortestDistanceToRoad(), CULD_SAC_SHORTESTDISTINCTTOROAD,
                                   * SUB_RULE_25_1_PROVISIO, SUB_RULE_25_1_PROVISIO, CULDESAC_ROAD + SUB_RULE_25_1_PROVISIO_DESC);
                                   * if (minimumHeightOfBuilding.compareTo(SEVEN) > 0) { exptectedDistance = FIVE; if
                                   * (!ProcessHelper.isSmallPlot(pl)) { if
                                   * (pl.getCuldeSacRoads().get(0).getDistancesFromCenterToPlot() != null &&
                                   * !pl.getCuldeSacRoads().get(0).getDistancesFromCenterToPlot().isEmpty())
                                   * checkBuildingDistanceFromRoad(pl, exptectedDistance,
                                   * pl.getCuldeSacRoads().get(0).getDistancesFromCenterToPlot(),
                                   * CULDESAC_SHORTESTDISTINCTTOROADFROMCENTER, SUB_RULE_25_1, SUB_RULE_25_1,
                                   * CULDESAC_SHORTESTDISTINCTTOROADFROMCENTER); } } } // validating minimum distance in lane
                                   * roads minimum 5m if (pl.getLaneRoads() != null && !pl.getLaneRoads().isEmpty()) { if
                                   * (ProcessHelper.isSmallPlot(pl)) { exptectedDistance = ONEPOINTFIVE; } else { if
                                   * (minimumHeightOfBuilding.compareTo(SEVEN) <= 0) exptectedDistance = ONEPOINTFIVE; else
                                   * exptectedDistance = THREE; } if (pl.getLaneRoads().get(0).getShortestDistanceToRoad() != null
                                   * && !pl.getLaneRoads().get(0).getShortestDistanceToRoad().isEmpty())
                                   * checkBuildingDistanceFromRoad(pl, exptectedDistance,
                                   * pl.getLaneRoads().get(0).getShortestDistanceToRoad(), LANE_SHORTESTDISTINCTTOROAD,
                                   * SUB_RULE_25_1_PROVISIO, SUB_RULE_25_1_PROVISIO, LANE_ROAD + SUB_RULE_25_1_PROVISIO_DESC); if
                                   * (minimumHeightOfBuilding.compareTo(SEVEN) > 0) { exptectedDistance = FIVE; if
                                   * (!ProcessHelper.isSmallPlot(pl)) { if
                                   * (pl.getLaneRoads().get(0).getDistancesFromCenterToPlot() != null &&
                                   * !pl.getLaneRoads().get(0).getDistancesFromCenterToPlot().isEmpty())
                                   * checkBuildingDistanceFromRoad(pl, exptectedDistance,
                                   * pl.getLaneRoads().get(0).getDistancesFromCenterToPlot(),
                                   * LANE_SHORTESTDISTINCTTOROADFROMCENTER, SUB_RULE_25_1, SUB_RULE_25_1,
                                   * LANE_SHORTESTDISTINCTTOROADFROMCENTER); } } }
                                   */
        return pl;

    }

    private void checkBuildingDistanceFromRoad(Plan pl, BigDecimal exptectedDistance,
            List<BigDecimal> roadDistances, String fieldVerified, String subRule, String rule, String subRuleDesc) {

        /*
         * BigDecimal minimumDistance =null; //Take minimum distance among road distance for (BigDecimal distance : roadDistances)
         * { if(minimumDistance==null) minimumDistance=distance; else if(distance.compareTo(minimumDistance)<0)
         * minimumDistance=distance; } if(minimumDistance!=null)
         */
        for (BigDecimal minimumDistance : roadDistances) {
            String expectedResult = getLocaleMessage(RULE_EXPECTED_KEY, exptectedDistance.toString());
            String actualResult = getLocaleMessage(RULE_ACTUAL_KEY, minimumDistance.toString());
            // compare minimum road distance with minimum expected value.
            if (exptectedDistance.compareTo(minimumDistance) > 0) {
                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, subRule);
                details.put(DESCRIPTION, subRuleDesc);
                details.put(REQUIRED, expectedResult);
                details.put(PROVIDED, actualResult);
                details.put(STATUS, Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            } else {
                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, subRule);
                details.put(DESCRIPTION, subRuleDesc);
                details.put(REQUIRED, expectedResult);
                details.put(PROVIDED, actualResult);
                details.put(STATUS, Result.Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

            }

        }
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
