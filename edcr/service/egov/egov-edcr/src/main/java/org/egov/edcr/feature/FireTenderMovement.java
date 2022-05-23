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
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.stereotype.Service;

@Service
public class FireTenderMovement extends FeatureProcess {
    private static final Logger LOG = LogManager.getLogger(FireTenderMovement.class);
    private static final BigDecimal FIFTEEN = BigDecimal.valueOf(15);
    private static final BigDecimal THREE_POINTSIXSIX = BigDecimal.valueOf(3.66);
    private static final String RULE_36_3 = "36-3";

    @Override
    public Plan validate(Plan plan) {
        return plan;
    }

    @Override
    public Plan process(Plan plan) {
        HashMap<String, String> errors = new HashMap<>();

        for (Block block : plan.getBlocks()) {

            ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
            scrutinyDetail.addColumnHeading(1, RULE_NO);
            scrutinyDetail.addColumnHeading(2, DESCRIPTION);
            scrutinyDetail.addColumnHeading(3, PERMISSIBLE);
            scrutinyDetail.addColumnHeading(4, PROVIDED);
            scrutinyDetail.addColumnHeading(5, STATUS);
            scrutinyDetail.setKey("Block_" + block.getNumber() + "_" + "Fire Tender Movement");

            if (block.getBuilding() != null
                    && block.getBuilding().getBuildingHeight().setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                            DcrConstants.ROUNDMODE_MEASUREMENTS).compareTo(FIFTEEN) > 0) {
                org.egov.common.entity.edcr.FireTenderMovement fireTenderMovement = block.getFireTenderMovement();
                if (fireTenderMovement != null) {
                    List<BigDecimal> widths = fireTenderMovement.getFireTenderMovements().stream()
                            .map(fireTenderMovmnt -> fireTenderMovmnt.getWidth()).collect(Collectors.toList());
                    BigDecimal minWidth = widths.stream().reduce(BigDecimal::min).get();
                    BigDecimal providedWidth = minWidth.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                            DcrConstants.ROUNDMODE_MEASUREMENTS);
                    Boolean isAccepted = providedWidth.compareTo(THREE_POINTSIXSIX) >= 0;

                    Map<String, String> details = new HashMap<>();
                    details.put(RULE_NO, RULE_36_3);
                    details.put(DESCRIPTION, "Width of fire tender movement");
                    details.put(PERMISSIBLE, ">= " + THREE_POINTSIXSIX.toString());
                    details.put(PROVIDED, providedWidth.toString());
                    details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
                    scrutinyDetail.getDetail().add(details);
                    plan.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

                    if (!fireTenderMovement.getErrors().isEmpty()) {
                        StringBuffer yardNames = new StringBuffer();

                        for (String yardName : fireTenderMovement.getErrors()) {
                            yardNames = yardNames.append(yardName).append(", ");
                        }
                        errors.put("FTM_SETBACK", "Fire tender movement for block " + block.getNumber() + " is not inside "
                                + yardNames.toString().substring(0, yardNames.length() - 2) + ".");
                        plan.addErrors(errors);
                    }
                } else {
                    errors.put("BLK_FTM_" + block.getNumber(), "Fire tender movement not defined for Block " + block.getNumber());
                    plan.addErrors(errors);
                }
            }
        }

        return plan;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }

}