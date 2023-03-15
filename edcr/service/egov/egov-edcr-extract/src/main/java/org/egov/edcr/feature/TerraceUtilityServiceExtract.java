/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency
,
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.TerraceUtility;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TerraceUtilityServiceExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(TerraceUtilityServiceExtract.class);
    public static final String TERRACEUTILITIESDISTANCE = "TerraceUtilitiesDistance";
    public static final String LAYER_NAME_TERRACEUTILITY = "LAYER_NAME_TERRACEUTILITY";

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        LOG.info("****Start - Extract terrace***");
        Map<String, Integer> subFeaturesColor = pl.getSubFeatureColorCodesMaster().get(TERRACEUTILITIESDISTANCE);

        if (pl.getBlocks() != null)
            for (Block block : pl.getBlocks()) {
                String layerName = String.format(layerNames.getLayerName(LAYER_NAME_TERRACEUTILITY), block.getNumber());
                List<DXFDimension> distances = Util.getDimensionsByLayer(pl.getDoc(), layerName);
                List<TerraceUtility> terraceUtilities = new ArrayList<>();
                Map<Integer, List<DXFDimension>> distancesByColor = new HashMap<>();
                if (distances != null && !distances.isEmpty()) {
                    distancesByColor = distances.stream().collect(Collectors.groupingBy(DXFDimension::getColor));
                }

                for (Map.Entry<String, Integer> subFeatureColor : subFeaturesColor.entrySet()) {
                    List<DXFDimension> dimensionsByColor = distancesByColor.get(subFeatureColor.getValue());
                    if (dimensionsByColor != null && !dimensionsByColor.isEmpty()) {
                        for (DXFDimension dimension : dimensionsByColor) {
                            terraceUtilities.add(build(pl, dimension, subFeatureColor, layerName));
                        }
                    }
                }

                block.setTerraceUtilities(terraceUtilities);
            }
        return pl;
    }

    private TerraceUtility build(PlanDetail pl, DXFDimension dim, Entry<String, Integer> sub, String layerName) {
        List<BigDecimal> dimensionValues = new ArrayList<>();
        LOG.info("****Terrace Utility - " + sub.getKey() + "- Distance---->>> " + dimensionValues);
        Util.extractDimensionValue(pl, dimensionValues, dim, layerName);
        TerraceUtility terraceUtility = new TerraceUtility();
        terraceUtility.setName(sub.getKey());
        terraceUtility.setColorCode(dim.getColor());
        terraceUtility.setDistances(dimensionValues);
        return terraceUtility;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }
}
