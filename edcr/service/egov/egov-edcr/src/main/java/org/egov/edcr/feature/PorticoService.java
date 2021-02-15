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

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Portico;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.DcrConstants;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PorticoService extends FeatureProcess {
	
	private static final String SUBRULE_PORTICO = "PORTICO";
	private static final String SUBRULE_PORTICO_MAX_LENGTHDESCRIPTION = "Maximum Portico length for portico %s ";
    public static final String PORTICO_DISTANCETO_EXTERIORWALL = "Block %s Portico %s Portico distance to exteriorwall";

    @Override
    public Plan validate(Plan plan) {
        HashMap<String, String> errors = new HashMap<>();

    	 for (Block block : plan.getBlocks()) {
    		 for(Portico portico:block.getPorticos())
    		 { 
    			 if(portico.getDistanceToExteriorWall().isEmpty())
    			 {
    				 errors.put(String.format(PORTICO_DISTANCETO_EXTERIORWALL, block.getNumber(),portico.getName()),
                             edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
                                     new String[] { String.format(PORTICO_DISTANCETO_EXTERIORWALL, block.getNumber(),portico.getName()) },
                                     LocaleContextHolder.getLocale()));
                     plan.addErrors(errors);
    			 }
    		 }
    	 }
        return plan;
    }

    @Override
    public Plan process(Plan plan) {
    	validate(plan);
		for (Block block : plan.getBlocks()) {

			for (Portico portico : block.getPorticos()) {

				  scrutinyDetail = new ScrutinyDetail();
	                scrutinyDetail.addColumnHeading(1, RULE_NO);
	                scrutinyDetail.addColumnHeading(2, DESCRIPTION);
	                scrutinyDetail.addColumnHeading(3, REQUIRED);
	                scrutinyDetail.addColumnHeading(4, PROVIDED);
	                scrutinyDetail.addColumnHeading(5, STATUS);
	                scrutinyDetail.setKey("Block_" + block.getNumber() + "_" + "Portico");
	                
				if (portico.getLength() != null) {

					if (portico.getLength().compareTo(BigDecimal.valueOf(4.6)) >= 0) {
						setReportOutputDetails(plan, SUBRULE_PORTICO,
								String.format(SUBRULE_PORTICO_MAX_LENGTHDESCRIPTION, portico.getName()), "Max 4.6 Mtr.",
								portico.getLength() + " Mtr.", Result.Accepted.getResultVal(), scrutinyDetail);
					} else {
						setReportOutputDetails(plan, SUBRULE_PORTICO,
								String.format(SUBRULE_PORTICO_MAX_LENGTHDESCRIPTION, portico.getName()), "Max 4.6 Mtr.",
								portico.getLength() + " Mtr.", Result.Not_Accepted.getResultVal(), scrutinyDetail);
					}
				}

			}
   	 }
    	
        return plan;
    }
    private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String expected, String actual, String status,
            ScrutinyDetail scrutinyDetail) {
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
