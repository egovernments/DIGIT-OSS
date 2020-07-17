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
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.utility.Util;
import org.egov.infra.utils.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class LandUse extends FeatureProcess {

    private static final Logger LOG = Logger.getLogger(LandUse.class);
    private static final String RULE_28 = "28";
    public static final BigDecimal ROAD_WIDTH_TWELVE_POINTTWO = BigDecimal.valueOf(12.2);
    private static final String ROAD_WIDTH = "Road Width";

    @Override
    public Plan validate(Plan pl) {

        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        HashMap<String, String> errors = new HashMap<>();

        validateCommercialZone(pl, errors);
        return pl;
    }

    private void validateCommercialZone(Plan pl, HashMap<String, String> errors) {

        for (Block block : pl.getBlocks()) {
            StringBuffer floorNos = new StringBuffer();
            boolean isAccepted = false;
            String blkNo = block.getNumber();
            scrutinyDetail.addColumnHeading(1, RULE_NO);
            scrutinyDetail.addColumnHeading(2, DESCRIPTION);
            scrutinyDetail.addColumnHeading(3, ROAD_WIDTH);
            scrutinyDetail.addColumnHeading(4, REQUIRED);
            scrutinyDetail.addColumnHeading(5, PROVIDED);
            scrutinyDetail.addColumnHeading(6, STATUS);
            scrutinyDetail.setKey("Block_" + blkNo + "_" + "Land Use");

            BigDecimal roadWidth = pl.getPlanInformation().getRoadWidth();
            if (pl.getPlanInformation() != null && roadWidth != null
                    && StringUtils.isNotBlank(pl.getPlanInformation().getLandUseZone())
                    && DxfFileConstants.COMMERCIAL.equalsIgnoreCase(pl.getPlanInformation().getLandUseZone())
                    && Util.roundOffTwoDecimal(roadWidth).compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0) {

                List<Floor> floors = block.getBuilding().getFloors();

                for (Floor floor : floors) {
                    List<Occupancy> occupancies = floor.getOccupancies();
                    List<String> occupancyTypes = new ArrayList<>();

                    for (Occupancy occupancy : occupancies) {
                        if (occupancy.getTypeHelper() != null && occupancy.getTypeHelper().getType() != null) {
                            occupancyTypes.add(occupancy.getTypeHelper().getType().getCode());
                        }

                        if (occupancy.getTypeHelper() != null && occupancy.getTypeHelper().getSubtype() != null) {
                            occupancyTypes.add(occupancy.getTypeHelper().getSubtype().getCode());
                        }
                    }

                    if (occupancyTypes.size() > 0) {
                        if (occupancyTypes.contains(DxfFileConstants.F)) {
                            floorNos.append(floor.getNumber()).append(",");
                        }
                    }
                }

                Map<String, String> details = new HashMap<>();
                details.put(RULE_NO, RULE_28);
                details.put(DESCRIPTION, "Land use Zone");
                details.put(ROAD_WIDTH, pl.getPlanInformation().getRoadWidth().toString());
                details.put(REQUIRED, "Atleast one floor should be commercial");
                details.put(PROVIDED, floorNos.length() == 0 ? "commercial floor is not present"
                        : floorNos.toString().substring(0, floorNos.length() - 1) + " floors are commercial");
                details.put(STATUS, isAccepted ? Result.Accepted.getResultVal() : Result.Not_Accepted.getResultVal());
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
