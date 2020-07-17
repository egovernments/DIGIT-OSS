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

import static org.egov.edcr.utility.DcrConstants.CANOPY_DISTANCE;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PetrolFillingStation extends FeatureProcess {
    private static final String SUBRULE_59_10 = "59-10";
    private static final String SUBRULE_59_10_DESC = "Minimum distance from canopy to plot boundary";

    @Override
    public Plan validate(Plan pl) {/*
                                    * HashMap<String, String> errors = new HashMap<>(); if (pl != null && pl.getVirtualBuilding()
                                    * != null && !pl.getVirtualBuilding().getOccupancies().isEmpty() &&
                                    * pl.getVirtualBuilding().getOccupancies().contains(OccupancyType.OCCUPANCY_F4) &&
                                    * pl.getVirtualBuilding().getOccupancies().contains(OccupancyType.OCCUPANCY_I2) &&
                                    * pl.getCanopyDistanceFromPlotBoundary().isEmpty()) { errors.put(CANOPY_DISTANCE,
                                    * edcrMessageSource.getMessage(OBJECTNOTDEFINED, new String[] { CANOPY_DISTANCE },
                                    * LocaleContextHolder.getLocale())); pl.addErrors(errors); }
                                    */
        return pl;
    }

    @Override
    public Plan process(Plan pl) {/*
                                   * validate(pl); Boolean valid = false; scrutinyDetail = new ScrutinyDetail();
                                   * scrutinyDetail.setKey("Common_Petrol Filling Station"); scrutinyDetail.addColumnHeading(1,
                                   * RULE_NO); scrutinyDetail.addColumnHeading(2, DESCRIPTION); scrutinyDetail.addColumnHeading(3,
                                   * REQUIRED); scrutinyDetail.addColumnHeading(4, PROVIDED); scrutinyDetail.addColumnHeading(5,
                                   * STATUS); if (pl != null && pl.getVirtualBuilding() != null &&
                                   * !pl.getVirtualBuilding().getOccupancies().isEmpty() &&
                                   * pl.getVirtualBuilding().getOccupancies().contains(OccupancyType.OCCUPANCY_F4) &&
                                   * pl.getVirtualBuilding().getOccupancies().contains(OccupancyType.OCCUPANCY_I2) &&
                                   * !pl.getCanopyDistanceFromPlotBoundary().isEmpty()) { BigDecimal
                                   * minimumCanopyDistanceFromPlotBoundary = pl.getCanopyDistanceFromPlotBoundary().get(0); for
                                   * (BigDecimal canopyDistanceFromPlotBoundary : pl.getCanopyDistanceFromPlotBoundary()) { if
                                   * (canopyDistanceFromPlotBoundary.compareTo(minimumCanopyDistanceFromPlotBoundary) < 0) {
                                   * minimumCanopyDistanceFromPlotBoundary = canopyDistanceFromPlotBoundary; } }
                                   * minimumCanopyDistanceFromPlotBoundary = BigDecimal.valueOf(
                                   * Math.round(minimumCanopyDistanceFromPlotBoundary.doubleValue() * Double.valueOf(100)) /
                                   * Double.valueOf(100)); if
                                   * (minimumCanopyDistanceFromPlotBoundary.compareTo(BigDecimal.valueOf(3)) >= 0) { valid = true;
                                   * } if (valid) { setReportOutputDetails(pl, SUBRULE_59_10, SUBRULE_59_10_DESC,
                                   * String.valueOf(3), minimumCanopyDistanceFromPlotBoundary.toString(),
                                   * Result.Accepted.getResultVal()); } else { setReportOutputDetails(pl, SUBRULE_59_10,
                                   * SUBRULE_59_10_DESC, String.valueOf(3), minimumCanopyDistanceFromPlotBoundary.toString(),
                                   * Result.Not_Accepted.getResultVal()); } }
                                   */
        return pl;
    }

    private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDescription, String expected, String actual,
            String status) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(DESCRIPTION, ruleDescription);
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
