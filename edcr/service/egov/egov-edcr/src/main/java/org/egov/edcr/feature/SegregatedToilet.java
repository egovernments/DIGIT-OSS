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

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.infra.utils.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class SegregatedToilet extends FeatureProcess {

    private static final Logger LOG = LogManager.getLogger(SegregatedToilet.class);
    private static final String RULE_59_10  = "59-10-i";
    public static final String SEGREGATEDTOILET_DESCRIPTION = "Num. of segregated toilets";
    public static final String SEGREGATEDTOILET_DIMENSION_DESCRIPTION = "Segregated toilet distance from main entrance";

    @Override
    public Plan validate(Plan pl) {

        return pl;
    }

    @Override
    public Plan process(Plan pl) {

        ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.setKey("Common_Segregated Toilet");
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        scrutinyDetail.addColumnHeading(3, REQUIRED);
        scrutinyDetail.addColumnHeading(4, PROVIDED);
        scrutinyDetail.addColumnHeading(5, STATUS);

        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, RULE_59_10);

        BigDecimal minDimension = BigDecimal.ZERO;
        BigDecimal maxHeightOfBuilding = BigDecimal.ZERO;
        BigDecimal maxNumOfFloorsOfBuilding = BigDecimal.ZERO;

        if (pl.getSegregatedToilet() != null && !pl.getSegregatedToilet().getDistancesToMainEntrance().isEmpty())
            minDimension = pl.getSegregatedToilet().getDistancesToMainEntrance().stream().reduce(BigDecimal::min).get();

        for (Block b : pl.getBlocks()) {
            if (b.getBuilding().getBuildingHeight() != null) {
                if (b.getBuilding() != null && b.getBuilding().getBuildingHeight().compareTo(maxHeightOfBuilding) > 0) {
                    maxHeightOfBuilding = b.getBuilding().getBuildingHeight();
                }
                if (b.getBuilding().getFloorsAboveGround() != null
                        && b.getBuilding().getFloorsAboveGround().compareTo(maxNumOfFloorsOfBuilding) > 0) {
                    maxNumOfFloorsOfBuilding = b.getBuilding().getFloorsAboveGround();
                }
            }
        }

        if (pl.getVirtualBuilding() != null && (pl.getVirtualBuilding().getMostRestrictiveFarHelper() != null
                && pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType() != null
                && ((StringUtils
                        .isNotBlank(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType().getCode())
                && DxfFileConstants.A
                        .equals(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType().getCode())
                && maxHeightOfBuilding.compareTo(new BigDecimal(15)) >= 0)
                || ((DxfFileConstants.I
                        .equals(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType().getCode())
                        || DxfFileConstants.A
                                .equals(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType().getCode())
                        || DxfFileConstants.E
                                .equals(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType().getCode()))
                        && pl.getVirtualBuilding().getTotalBuitUpArea() != null
                        && pl.getVirtualBuilding().getTotalBuitUpArea().compareTo(new BigDecimal(1000)) >= 0
                        && maxNumOfFloorsOfBuilding.compareTo(new BigDecimal(2)) >= 0)
                || (DxfFileConstants.C
                        .equals(pl.getVirtualBuilding().getMostRestrictiveFarHelper().getType().getCode())
                        && pl.getVirtualBuilding().getTotalBuitUpArea() != null
                        && pl.getVirtualBuilding().getTotalBuitUpArea().compareTo(new BigDecimal(500)) >= 0)))) {

            if (pl.getSegregatedToilet() != null && pl.getSegregatedToilet().getSegregatedToilets() != null
                    && !pl.getSegregatedToilet().getSegregatedToilets().isEmpty()) {
                details.put(DESCRIPTION, SEGREGATEDTOILET_DESCRIPTION);
                details.put(REQUIRED, "1");
                details.put(PROVIDED, String.valueOf(pl.getSegregatedToilet().getSegregatedToilets().size()));
                details.put(STATUS, Result.Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            } else {
                details.put(DESCRIPTION, SEGREGATEDTOILET_DESCRIPTION);
                details.put(REQUIRED, "1");
                details.put(PROVIDED, "0");
                details.put(STATUS, Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }

            if (minDimension != null && minDimension.compareTo(new BigDecimal(200)) >= 0) {
                details.put(DESCRIPTION, SEGREGATEDTOILET_DIMENSION_DESCRIPTION);
                details.put(REQUIRED, ">= 200");
                details.put(PROVIDED, minDimension.toString());
                details.put(STATUS, Result.Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            } else {
                details.put(DESCRIPTION, SEGREGATEDTOILET_DIMENSION_DESCRIPTION);
                details.put(REQUIRED, ">= 200");
                details.put(PROVIDED, minDimension.toString());
                details.put(STATUS, Result.Not_Accepted.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            }

        }

        return pl;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }

}
