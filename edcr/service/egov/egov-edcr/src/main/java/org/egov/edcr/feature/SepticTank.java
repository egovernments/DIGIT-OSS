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

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.infra.utils.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class SepticTank extends FeatureProcess {

	private static final Logger LOG = LogManager.getLogger(SepticTank.class);
	private static final String RULE_45_E = "45-e";
	public static final String DISTANCE_FROM_WATERSOURCE = "Distance from watersource";
	public static final String DISTANCE_FROM_BUILDING = "Distance from Building";
	public static final String MIN_DISTANCE_FROM_GOVTBUILDING_DESC = "Minimum distance fcrom government building";
	public static final BigDecimal MIN_DIS_WATERSRC = BigDecimal.valueOf(18);
	public static final BigDecimal MIN_DIS_BUILDING = BigDecimal.valueOf(6);

	@Override
	public Plan validate(Plan pl) {
		return pl;
	}

	@Override
	public Plan process(Plan pl) {

		ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
		scrutinyDetail.setKey("Common_Septic Tank ");
		scrutinyDetail.addColumnHeading(1, RULE_NO);
		scrutinyDetail.addColumnHeading(2, DESCRIPTION);
		scrutinyDetail.addColumnHeading(3, PERMITTED);
		scrutinyDetail.addColumnHeading(4, PROVIDED);
		scrutinyDetail.addColumnHeading(5, STATUS);
		List<org.egov.common.entity.edcr.SepticTank> septicTanks = pl.getSepticTanks();

		for (org.egov.common.entity.edcr.SepticTank septicTank : septicTanks) {
			boolean validWaterSrcDistance = false;
			boolean validBuildingDistance = false;

			if (!septicTank.getDistanceFromWaterSource().isEmpty()) {
				BigDecimal minDistWaterSrc = septicTank.getDistanceFromWaterSource().stream().reduce(BigDecimal::min)
						.get();
				if (minDistWaterSrc != null && minDistWaterSrc.compareTo(MIN_DIS_WATERSRC) >= 0) {
					validWaterSrcDistance = true;
				}
				buildResult(pl, scrutinyDetail, validWaterSrcDistance, DISTANCE_FROM_WATERSOURCE, ">= 18",
						minDistWaterSrc.toString());
			}

			if (!septicTank.getDistanceFromBuilding().isEmpty()) {
				BigDecimal minDistBuilding = septicTank.getDistanceFromBuilding().stream().reduce(BigDecimal::min)
						.get();
				if (minDistBuilding != null && minDistBuilding.compareTo(MIN_DIS_BUILDING) >= 0) {
					validBuildingDistance = true;
				}
				buildResult(pl, scrutinyDetail, validBuildingDistance, DISTANCE_FROM_BUILDING, ">= 6",
						minDistBuilding.toString());
			}
		}

		return pl;
	}

	private void buildResult(Plan pl, ScrutinyDetail scrutinyDetail, boolean valid, String description, String permited,
			String provided) {
		Map<String, String> details = new HashMap<>();
		details.put(RULE_NO, RULE_45_E);
		details.put(DESCRIPTION, description);
		details.put(PERMITTED, permited);
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
