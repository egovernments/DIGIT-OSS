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

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.Util;
import org.springframework.stereotype.Service;


@Service
public class PassageService extends FeatureProcess {
		private static final String RULE41 = "41";
		private static final String RULE39_6 = "39(6)";
		private static final String PASSAGE_STAIR_MINIMUM_WIDTH = "1.2";
		private static final String RULE39_6_DESCRIPTION = "The minimum passage giving access to stair";
		private static final String RULE_41_DESCRIPTION = "The minimum width of corridors/ verandhas";
		
	@Override
	public Plan validate(Plan plan) {
		return plan;
	}

	@Override
	public Plan process(Plan plan) {
		for (Block block : plan.getBlocks()) {
			if (block.getBuilding() != null) {

				ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
				scrutinyDetail.addColumnHeading(1, RULE_NO);
				scrutinyDetail.addColumnHeading(2, REQUIRED);
				scrutinyDetail.addColumnHeading(3, PROVIDED);
				scrutinyDetail.addColumnHeading(4, STATUS);
				scrutinyDetail.setKey("Block_" + block.getNumber() + "_" + "Passage");

				ScrutinyDetail scrutinyDetail1 = new ScrutinyDetail();
				scrutinyDetail1.addColumnHeading(1, RULE_NO);
				scrutinyDetail1.addColumnHeading(2, REQUIRED);
				scrutinyDetail1.addColumnHeading(3, PROVIDED);
				scrutinyDetail1.addColumnHeading(4, STATUS);
				scrutinyDetail1.setKey("Block_" + block.getNumber() + "_" + "Passage Stair");

				org.egov.common.entity.edcr.Passage passage = block.getBuilding().getPassage();

				if (passage != null) {

					List<BigDecimal> passagePolylines = passage.getPassageDimensions();
					List<BigDecimal> passageStairPolylines = passage.getPassageStairDimensions();

					if (passagePolylines != null && passagePolylines.size() > 0) {

						BigDecimal minPassagePolyLine = 
						passagePolylines.stream().reduce(BigDecimal::min).get();

						BigDecimal minWidth = Util.roundOffTwoDecimal(minPassagePolyLine);
						
						if (minWidth.compareTo(BigDecimal.ONE) >= 0) {
							setReportOutputDetails(plan, RULE41, RULE_41_DESCRIPTION,
									String.valueOf(1), String.valueOf(minWidth), Result.Accepted.getResultVal(),
									scrutinyDetail);
						} else {
							setReportOutputDetails(plan, RULE41, RULE_41_DESCRIPTION,
									String.valueOf(1), String.valueOf(minWidth), Result.Not_Accepted.getResultVal(),
									scrutinyDetail);
						}
					}

					if (passageStairPolylines != null && passageStairPolylines.size() > 0) {

						BigDecimal minPassageStairPolyLine = passageStairPolylines.stream().reduce(BigDecimal::min).get();;

						BigDecimal minWidth = Util.roundOffTwoDecimal(minPassageStairPolyLine);
						
						if (minWidth.compareTo(Util.roundOffTwoDecimal(BigDecimal.valueOf(1.2))) >= 0) {
							setReportOutputDetails(plan, RULE39_6, RULE39_6_DESCRIPTION,
									PASSAGE_STAIR_MINIMUM_WIDTH, String.valueOf(minWidth), Result.Accepted.getResultVal(),
									scrutinyDetail1);
						} else {
							setReportOutputDetails(plan, RULE39_6, RULE39_6_DESCRIPTION,
									PASSAGE_STAIR_MINIMUM_WIDTH, String.valueOf(minWidth), Result.Not_Accepted.getResultVal(),
									scrutinyDetail1);
						}
					}

				}
			}
		}
		return plan;
	}

	private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String expected, String actual,
			String status, ScrutinyDetail scrutinyDetail) {
		Map<String, String> details = new HashMap<>();
		details.put(RULE_NO, ruleNo);
		details.put(DESCRIPTION, ruleDesc);
		details.put(REQUIRED, expected);
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
