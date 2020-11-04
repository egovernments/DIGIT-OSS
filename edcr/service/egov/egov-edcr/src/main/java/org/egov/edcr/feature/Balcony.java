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
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.springframework.stereotype.Service;

@Service
public class Balcony extends FeatureProcess {
    private static final Logger LOG = Logger.getLogger(Balcony.class);
    private static final String FLOOR = "Floor";
    private static final String RULE45_IV = "45-iv";
    private static final String WIDTH_BALCONY_DESCRIPTION = "Minimum width for balcony %s";
    private static final BigDecimal ONE_POINTTWO = BigDecimal.valueOf(1.2);

    @Override
    public Plan validate(Plan plan) {
        return plan;
    }

    @Override
    public Plan process(Plan plan) {
        for (Block block : plan.getBlocks()) {
            if (block.getBuilding() != null) {

                ScrutinyDetail scrutinyDetailLanding = new ScrutinyDetail();
                scrutinyDetailLanding.addColumnHeading(1, RULE_NO);
                scrutinyDetailLanding.addColumnHeading(2, FLOOR);
                scrutinyDetailLanding.addColumnHeading(3, DESCRIPTION);
                scrutinyDetailLanding.addColumnHeading(4, PERMISSIBLE);
                scrutinyDetailLanding.addColumnHeading(5, PROVIDED);
                scrutinyDetailLanding.addColumnHeading(6, STATUS);
                scrutinyDetailLanding.setKey("Block_" + block.getNumber() + "_" + "Balcony");
                List<Floor> floors = block.getBuilding().getFloors();

                for (Floor floor : floors) {
                    boolean isTypicalRepititiveFloor = false;

                    Map<String, Object> typicalFloorValues = Util.getTypicalFloorValues(block, floor,
                            isTypicalRepititiveFloor);

                    List<org.egov.common.entity.edcr.Balcony> balconies = floor.getBalconies();
                    if (!balconies.isEmpty()) {
                        for (org.egov.common.entity.edcr.Balcony balcony : balconies) {
                            boolean isAccepted = false;
                            List<BigDecimal> widths = balcony.getWidths();
                            BigDecimal minWidth = widths.isEmpty() ? BigDecimal.ZERO : widths.stream().reduce(BigDecimal::min).get();
                            minWidth = minWidth.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                                    DcrConstants.ROUNDMODE_MEASUREMENTS);
                            if (minWidth.compareTo(ONE_POINTTWO.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                                    DcrConstants.ROUNDMODE_MEASUREMENTS)) >= 0) {
                                isAccepted = true;
                            }

                            String value = typicalFloorValues.get("typicalFloors") != null
                                    ? (String) typicalFloorValues.get("typicalFloors")
                                    : " floor " + floor.getNumber();

                            if (isAccepted) {
                                setReportOutputDetailsFloorBalconyWise(plan, RULE45_IV, value,
                                        String.format(WIDTH_BALCONY_DESCRIPTION, balcony.getNumber()),
                                        ONE_POINTTWO.toString(),
                                        String.valueOf(minWidth), Result.Accepted.getResultVal(), scrutinyDetailLanding);
                            } else {
                                setReportOutputDetailsFloorBalconyWise(plan, RULE45_IV, value,
                                        String.format(WIDTH_BALCONY_DESCRIPTION, balcony.getNumber()),
                                        ONE_POINTTWO.toString(),
                                        String.valueOf(minWidth), Result.Not_Accepted.getResultVal(), scrutinyDetailLanding);
                            }
                        }
                    }

                }

            }
        }

        return plan;
    }

    private void setReportOutputDetailsFloorBalconyWise(Plan pl, String ruleNo, String floor, String description,
            String expected, String actual, String status, ScrutinyDetail scrutinyDetail) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(FLOOR, floor);
        details.put(DESCRIPTION, description);
        details.put(PERMISSIBLE, expected);
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