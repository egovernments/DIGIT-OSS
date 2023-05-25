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
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.CompoundWall;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author vinoth
 *
 */
@Service
public class CompoundWallServiceExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(CompoundWallServiceExtract.class);

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail pl) {
        LOG.info("****Start - Extract compound wall***");
        Map<String, Integer> subFeaturesColor = pl.getSubFeatureColorCodesMaster().get("CompoundWall");
        List<Measurement> wallHeights = new ArrayList<>();
        List<Measurement> railingHeights = new ArrayList<>();
        String compoundWallRegex = layerNames.getLayerName("LAYER_NAME_COMPOUNDWALL");
        List<DXFDimension> compoundHeights = Util.getDimensionsByLayer(pl.getDoc(), compoundWallRegex);
        if (!compoundHeights.isEmpty()) {
            for (DXFDimension dim : compoundHeights) {
                subFeaturesColor.entrySet().stream().forEach(sub -> {
                    if (sub.getKey().equalsIgnoreCase("RailingHeight")
                            && sub.getValue().equals(Integer.valueOf(dim.getColor()))) {
                        railingHeights.add(buildHeight(pl, dim, sub, compoundWallRegex));
                    } else if ((sub.getKey().equalsIgnoreCase("FrontHeight") ||
                    		sub.getKey().equalsIgnoreCase("RearHeight"))
                            && sub.getValue().equals(Integer.valueOf(dim.getColor()))) {
                        wallHeights.add(buildHeight(pl, dim, sub, compoundWallRegex));
                    }
                });
            }
        }
        CompoundWall cw = new CompoundWall();
        cw.setWallHeights(wallHeights);
        cw.setRailingHeights(railingHeights);
        pl.setCompoundWall(cw);
        return pl;
    }

    private Measurement buildHeight(PlanDetail pl, DXFDimension dim, Entry<String, Integer> sub, String layerName) {
        List<BigDecimal> values = new ArrayList<>();
        LOG.info("****Compound wall -"+sub.getKey()+"- Heights---->>>"+values);
        Util.extractDimensionValue(pl, values, dim, layerName);
        Measurement measurement = new Measurement();
        measurement.setName(sub.getKey());
        measurement.setColorCode(dim.getColor());
        measurement.setHeight(values.isEmpty() ? BigDecimal.ZERO : values.get(0));
        return measurement;
    }

}
