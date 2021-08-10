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
import java.util.stream.Collectors;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.common.entity.edcr.SetBack;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.stereotype.Service;

@Service
public class PlantationGreenStrip extends FeatureProcess {

    private static final String RULE_37_6 = "37-6";

    @Override
    public Plan validate(Plan pl) {
        return null;
    }

    @Override
    public Plan process(Plan pl) {
        if (pl.getPlot() != null && pl.getPlot().getArea().compareTo(BigDecimal.valueOf(300)) > 0) {
            for (Block block : pl.getBlocks()) {

                ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
                scrutinyDetail.addColumnHeading(1, RULE_NO);
                scrutinyDetail.addColumnHeading(2, DESCRIPTION);
                scrutinyDetail.addColumnHeading(3, PERMISSIBLE);
                scrutinyDetail.addColumnHeading(4, PROVIDED);
                scrutinyDetail.addColumnHeading(5, STATUS);
                scrutinyDetail.setKey("Block_" + block.getNumber() + "_" + "Continuous Green Planting Strip");

                boolean isWidthAccepted = false;
                // boolean isHeightAccepted = false;
                BigDecimal minWidth = BigDecimal.ZERO;
                // BigDecimal minHeight = BigDecimal.ZERO;
                List<BigDecimal> widths = block.getPlantationGreenStripes().stream()
                        .map(greenStrip -> greenStrip.getWidth()).collect(Collectors.toList());
                /*
                 * List<BigDecimal> heights = block.getPlantationGreenStripes().stream() .map(greenStripe ->
                 * greenStripe.getHeight()).collect(Collectors.toList());
                 */
                // List<BigDecimal> minimumDistances = new ArrayList<>();

                if (widths.isEmpty()) {
                    pl.addError("RULE_37_6", getLocaleMessage(DcrConstants.OBJECTNOTDEFINED,
                            "Block " + block.getNumber() + " " + "Continuous Green Planting Strip"));
                }
                /*
                 * for (SetBack setBack : block.getSetBacks()) { if (setBack.getRearYard() != null)
                 * minimumDistances.add(setBack.getRearYard().getHeight()); if (setBack.getSideYard1() != null)
                 * minimumDistances.add(setBack.getSideYard1().getHeight()); if (setBack.getSideYard2() != null)
                 * minimumDistances.add(setBack.getSideYard2().getHeight()); }
                 */

                if (!widths.isEmpty()) {
                    minWidth = widths.stream().reduce(BigDecimal::min).get();
                    // minHeight = heights.stream().reduce(BigDecimal::min).get();
                    // BigDecimal minLength = Collections.min(minimumDistances);

                    if (minWidth.compareTo(BigDecimal.valueOf(0.6)) >= 0) {
                        isWidthAccepted = true;

                    }

                    /*
                     * if (minHeight.doubleValue()>=1d) { isHeightAccepted = true; }
                     */

                    /*
                     * if (minHeight.doubleValue()>=minLength.doubleValue()) { isHeightAccepted = true; }
                     */
                    buildResult(pl, scrutinyDetail, isWidthAccepted, "Width of continuos plantation green strip",
                            ">= 0.6",
                            minWidth.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS)
                                    .toString());
                    /*
                     * buildResult(pl, scrutinyDetail, isHeightAccepted, "length of continuos plantation green strip ",
                     * "should be equal to rear or side yard",
                     * minHeight.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,DcrConstants.ROUNDMODE_MEASUREMENTS).toString())
                     * ;
                     */
                }
            }
        }
        return pl;
    }

    private void buildResult(Plan pl, ScrutinyDetail scrutinyDetail, boolean valid, String description, String permited,
            String provided) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, RULE_37_6);
        details.put(DESCRIPTION, description);
        details.put(PERMISSIBLE, permited);
        details.put(PROVIDED, provided);
        details.put(STATUS, valid ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
        scrutinyDetail.getDetail().add(details);
        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
