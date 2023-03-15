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

import static org.egov.edcr.utility.DcrConstants.HEIGHTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.WRONGHEIGHTDEFINED;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.SetBack;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SetBackService extends FeatureProcess {

    @Autowired
    private FrontYardService frontYardService;

    @Autowired
    private SideYardService sideYardService;

    @Autowired
    private RearYardService rearYardService;

    @Override
    public Plan validate(Plan pl) {
        HashMap<String, String> errors = new HashMap<>();
        // Assumption: if height of one level, should be less than next level. this condition not validated.as in each level user
        // can define different height.
        BigDecimal heightOfBuilding = BigDecimal.ZERO;
        for (Block block : pl.getBlocks()) {
            heightOfBuilding = block.getBuilding().getBuildingHeight();
            int i = 0;
            if (!block.getCompletelyExisting()) {
                for (SetBack setback : block.getSetBacks()) {
                    i++;
                    // if height not defined other than 0 level , then throw error.
                    if (setback.getLevel() == 0) {
                        // for level 0, all the yards are mandatory. Else throw error.
                        if (setback.getFrontYard() == null)
                            errors.put("frontyardNodeDefined",
                                    getLocaleMessage(OBJECTNOTDEFINED, " SetBack of " + block.getName() + "  at level zero "));
                        if (setback.getRearYard() == null
                                && !pl.getPlanInformation().getNocToAbutRearDesc().equalsIgnoreCase(DcrConstants.YES))
                            errors.put("rearyardNodeDefined",
                                    getLocaleMessage(OBJECTNOTDEFINED, " Rear Setback of  " + block.getName() + "  at level zero "));
                        if (setback.getSideYard1() == null)
                            errors.put("side1yardNodeDefined", getLocaleMessage(OBJECTNOTDEFINED,
                                    " Side Setback 1 of block " + block.getName() + " at level zero"));
                        if (setback.getSideYard2() == null
                                && !pl.getPlanInformation().getNocToAbutSideDesc().equalsIgnoreCase(DcrConstants.YES))
                            errors.put("side2yardNodeDefined", getLocaleMessage(OBJECTNOTDEFINED,
                                    " Side Setback 2 of block " + block.getName() + " at level zero "));
                    } else if (setback.getLevel() > 0) {
                        // height defined in level other than zero must contain height
                        if (setback.getFrontYard() != null && setback.getFrontYard().getHeight() == null)
                            errors.put("frontyardnotDefinedHeight", getLocaleMessage(HEIGHTNOTDEFINED, "Front Setback ",
                                    block.getName(), setback.getLevel().toString()));
                        if (setback.getRearYard() != null && setback.getRearYard().getHeight() == null)
                            errors.put("rearyardnotDefinedHeight", getLocaleMessage(HEIGHTNOTDEFINED, "Rear Setback ",
                                    block.getName(), setback.getLevel().toString()));
                        if (setback.getSideYard1() != null && setback.getSideYard1().getHeight() == null)
                            errors.put("side1yardnotDefinedHeight", getLocaleMessage(HEIGHTNOTDEFINED, "Side Setback 1 ",
                                    block.getName(), setback.getLevel().toString()));
                        if (setback.getSideYard2() != null && setback.getSideYard2().getHeight() == null)
                            errors.put("side2yardnotDefinedHeight", getLocaleMessage(HEIGHTNOTDEFINED, "Side Setback 2 ",
                                    block.getName(), setback.getLevel().toString()));
                    }

                    // if height of setback greater than building height ?
                    // last level height should match with building height.

                    if (setback.getLevel() > 0 && block.getSetBacks().size() == i) {
                        if (setback.getFrontYard() != null && setback.getFrontYard().getHeight() != null
                                && setback.getFrontYard().getHeight().compareTo(heightOfBuilding) != 0)
                            errors.put("frontyardDefinedWrongHeight", getLocaleMessage(WRONGHEIGHTDEFINED, "Front Setback ",
                                    block.getName(), setback.getLevel().toString(), heightOfBuilding.toString()));
                        if (setback.getRearYard() != null && setback.getRearYard().getHeight() != null
                                && setback.getRearYard().getHeight().compareTo(heightOfBuilding) != 0)
                            errors.put("rearyardDefinedWrongHeight", getLocaleMessage(WRONGHEIGHTDEFINED, "Rear Setback ",
                                    block.getName(), setback.getLevel().toString(), heightOfBuilding.toString()));
                        if (setback.getSideYard1() != null && setback.getSideYard1().getHeight() != null
                                && setback.getSideYard1().getHeight().compareTo(heightOfBuilding) != 0)
                            errors.put("side1yardDefinedWrongHeight", getLocaleMessage(WRONGHEIGHTDEFINED, "Side Setback 1 ",
                                    block.getName(), setback.getLevel().toString(), heightOfBuilding.toString()));
                        if (setback.getSideYard2() != null && setback.getSideYard2().getHeight() != null
                                && setback.getSideYard2().getHeight().compareTo(heightOfBuilding) != 0)
                            errors.put("side2yardDefinedWrongHeight", getLocaleMessage(WRONGHEIGHTDEFINED, "Side Setback 2 ",
                                    block.getName(), setback.getLevel().toString(), heightOfBuilding.toString()));
                    }
                }
            }
        }
        if (errors.size() > 0)
            pl.addErrors(errors);

        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        validate(pl);
        
		BigDecimal depthOfPlot = pl.getPlanInformation().getDepthOfPlot();
		if (depthOfPlot != null && depthOfPlot.compareTo(BigDecimal.ZERO) > 0) {
			frontYardService.processFrontYard(pl);
			rearYardService.processRearYard(pl);
		}

		BigDecimal widthOfPlot = pl.getPlanInformation().getWidthOfPlot();
		if (widthOfPlot != null && widthOfPlot.compareTo(BigDecimal.ZERO) > 0) {
			sideYardService.processSideYard(pl);
		}

        return pl;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
