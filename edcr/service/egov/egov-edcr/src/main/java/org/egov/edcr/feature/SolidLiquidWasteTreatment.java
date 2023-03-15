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

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.FloorUnit;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.stereotype.Service;

@Service
public class SolidLiquidWasteTreatment extends FeatureProcess {

    public static final String SUBRULE_55_11_DESC = "Collection and disposal of solid and liquid Waste";

    private static final String SUBRULE_55_11 = "55-11";

    @Override
    public Plan validate(Plan pl) {
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        /*
         * validate(pl); processSolidLiquidWasteTreat(pl);
         */
        return pl;
    }

    private void processSolidLiquidWasteTreat(Plan pl) {
        validate(pl);
        scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        scrutinyDetail.addColumnHeading(3, FIELDVERIFIED);
        scrutinyDetail.addColumnHeading(4, STATUS);
        scrutinyDetail.setKey("Common_Collection and disposal of Solid and Liquid Waste");
        if (pl != null && !pl.getBlocks().isEmpty()) {
            Boolean isFound = false;
            for (Block b : pl.getBlocks()) {
                for (Floor f : b.getBuilding().getFloors()) {
                    for (FloorUnit unit : f.getUnits()) {
                        if (OccupancyType.OCCUPANCY_E.equals(unit.getOccupancy().getType())) {
                            isFound = true;
                        }
                    }
                }
            }
            if (isFound && pl.getUtility().getSolidLiqdWasteTrtmnt().isEmpty()) {

                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, SUBRULE_55_11);
                details.put(DESCRIPTION, SUBRULE_55_11_DESC);
                /*
                 * Marked as verify. As per rule, This rule applicable for wedding hall. There is no colour code specific to
                 * identify business. For other type of business, this might not mandatory.
                 */
                details.put(FIELDVERIFIED, "Not Defined in plan. Verify whether required for defined Business.");
                details.put(STATUS, Result.Verify.getResultVal());
                scrutinyDetail.getDetail().add(details);
                pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
            } else if (isFound && !pl.getUtility().getSolidLiqdWasteTrtmnt().isEmpty()) {

                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, SUBRULE_55_11);
                details.put(DESCRIPTION, SUBRULE_55_11_DESC);
                details.put(FIELDVERIFIED, "Defined in the Plan.");
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
