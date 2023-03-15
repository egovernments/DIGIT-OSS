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
import java.util.EnumSet;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.utils.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class Coverage extends FeatureProcess {
    // private static final String OCCUPANCY2 = "OCCUPANCY";

    private static final Logger LOG = LogManager.getLogger(Coverage.class);

    //private static final String RULE_NAME_KEY = "coverage.rulename";
    private static final String RULE_DESCRIPTION_KEY = "coverage.description";
    private static final String RULE_EXPECTED_KEY = "coverage.expected";
    private static final String RULE_ACTUAL_KEY = "coverage.actual";
   // private static final BigDecimal ThirtyFive = BigDecimal.valueOf(35);
    private static final BigDecimal Forty = BigDecimal.valueOf(40);
	/*
	 * private static final BigDecimal FortyFive = BigDecimal.valueOf(45); private
	 * static final BigDecimal Sixty = BigDecimal.valueOf(60); private static final
	 * BigDecimal SixtyFive = BigDecimal.valueOf(65); private static final
	 * BigDecimal Seventy = BigDecimal.valueOf(70); private static final BigDecimal
	 * SeventyFive = BigDecimal.valueOf(75); private static final BigDecimal Eighty
	 * = BigDecimal.valueOf(80);
	 */
    public static final String RULE_38 = "38";
    private static final BigDecimal ROAD_WIDTH_TWELVE_POINTTWO = BigDecimal.valueOf(12.2);
    private static final BigDecimal ROAD_WIDTH_THIRTY_POINTFIVE = BigDecimal.valueOf(30.5);
    
    @Override
    public Plan validate(Plan pl) {
        for (Block block : pl.getBlocks()) {
            if (block.getCoverage().isEmpty()) {
                pl.addError("coverageArea" + block.getNumber(), "Coverage Area for block " + block.getNumber() + " not Provided");
            }
        }
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        validate(pl);
        BigDecimal totalCoverage = BigDecimal.ZERO;
        BigDecimal totalCoverageArea = BigDecimal.ZERO;

        for (Block block : pl.getBlocks()) {
            BigDecimal coverageAreaWithoutDeduction = BigDecimal.ZERO;
            BigDecimal coverageDeductionArea = BigDecimal.ZERO;

            for (Measurement coverage : block.getCoverage()) {
                coverageAreaWithoutDeduction = coverageAreaWithoutDeduction.add(coverage.getArea());
            }
            for (Measurement deduct : block.getCoverageDeductions()) {
                coverageDeductionArea = coverageDeductionArea.add(deduct.getArea());
            }
            if (block.getBuilding() != null) {
                block.getBuilding().setCoverageArea(coverageAreaWithoutDeduction.subtract(coverageDeductionArea));
                BigDecimal coverage = BigDecimal.ZERO;
                if (pl.getPlot().getArea().doubleValue() > 0)
                    coverage = block.getBuilding().getCoverageArea().multiply(BigDecimal.valueOf(100)).divide(
                            pl.getPlanInformation().getPlotArea(), DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                            DcrConstants.ROUNDMODE_MEASUREMENTS);

                block.getBuilding().setCoverage(coverage);

                totalCoverageArea = totalCoverageArea.add(block.getBuilding().getCoverageArea());
                // totalCoverage =
                // totalCoverage.add(block.getBuilding().getCoverage());
            }

        }

      //  pl.setCoverageArea(totalCoverageArea);
        // use plotBoundaryArea
        if (pl.getPlot() != null && pl.getPlot().getArea().doubleValue() > 0)
            totalCoverage = totalCoverageArea.multiply(BigDecimal.valueOf(100)).divide(pl.getPlanInformation().getPlotArea(),
                    DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);
        pl.setCoverage(totalCoverage);
        if (pl.getVirtualBuilding() != null) {
            pl.getVirtualBuilding().setTotalCoverageArea(totalCoverageArea);
        }

       BigDecimal roadWidth = pl.getPlanInformation().getRoadWidth();
       if(roadWidth != null && roadWidth.compareTo(ROAD_WIDTH_TWELVE_POINTTWO) >= 0
				&& roadWidth.compareTo(ROAD_WIDTH_THIRTY_POINTFIVE) <= 0) {
        processCoverage(pl, StringUtils.EMPTY, totalCoverage, Forty);
       }
		/*
		 * // for weighted coverage if (pl.getPlot().getArea().doubleValue() >= 5000) {
		 * BigDecimal provideCoverage = BigDecimal.ZERO; BigDecimal weightedArea =
		 * BigDecimal.ZERO; BigDecimal weightedCoverage = BigDecimal.ZERO; weightedArea
		 * = weightedArea.setScale(DECIMALDIGITS_MEASUREMENTS, ROUNDMODE_MEASUREMENTS);
		 * weightedCoverage = weightedCoverage.setScale(DECIMALDIGITS_MEASUREMENTS,
		 * ROUNDMODE_MEASUREMENTS); provideCoverage =
		 * provideCoverage.setScale(DECIMALDIGITS_MEASUREMENTS, ROUNDMODE_MEASUREMENTS);
		 * 
		 * for (Occupancy occ : pl.getOccupancies()) { BigDecimal occupancyWiseCoverage
		 * = occ.getBuiltUpArea().multiply(getPermissibleCoverage(occ.getType()));
		 * weightedArea = weightedArea.add(occupancyWiseCoverage);
		 * 
		 * } if (pl.getVirtualBuilding().getTotalBuitUpArea().doubleValue() > 0)
		 * weightedCoverage =
		 * weightedArea.divide(pl.getVirtualBuilding().getTotalBuitUpArea(),
		 * DECIMALDIGITS, ROUNDMODE_MEASUREMENTS); if
		 * (pl.getPlot().getArea().doubleValue() > 0) provideCoverage =
		 * pl.getCoverageArea() .divide(pl.getPlot().getPlotBndryArea(), DECIMALDIGITS,
		 * ROUNDMODE_MEASUREMENTS) .multiply(BigDecimal.valueOf(100)); //
		 * provideCoverage.setScale(2); processCoverage(pl, "-",
		 * provideCoverage.setScale(2, ROUNDMODE_MEASUREMENTS),
		 * weightedCoverage.setScale(2, ROUNDMODE_MEASUREMENTS)); }
		 */ /*
			 * else { boolean exemption = ProcessHelper.isSmallPlot(pl); if (!exemption) {
			 * OccupancyType mostRestrictiveOccupancy = getMostRestrictiveCoverage(
			 * pl.getVirtualBuilding().getOccupancies()); if (mostRestrictiveOccupancy !=
			 * null) { switch (mostRestrictiveOccupancy) { case OCCUPANCY_B1: case
			 * OCCUPANCY_B2: case OCCUPANCY_B3: processCoverage(pl,
			 * mostRestrictiveOccupancy.getOccupancyTypeVal(), totalCoverage, ThirtyFive);
			 * break; case OCCUPANCY_D: case OCCUPANCY_D1: case OCCUPANCY_I2:
			 * processCoverage(pl, mostRestrictiveOccupancy.getOccupancyTypeVal(),
			 * totalCoverage, Forty); break; case OCCUPANCY_I1: processCoverage(pl,
			 * mostRestrictiveOccupancy.getOccupancyTypeVal(), totalCoverage, FortyFive);
			 * break;
			 * 
			 * case OCCUPANCY_C: processCoverage(pl,
			 * mostRestrictiveOccupancy.getOccupancyTypeVal(), totalCoverage, Sixty); break;
			 * 
			 * case OCCUPANCY_A1: case OCCUPANCY_A4: case OCCUPANCY_A2: case OCCUPANCY_G1:
			 * processCoverage(pl, mostRestrictiveOccupancy.getOccupancyTypeVal(),
			 * totalCoverage, SixtyFive); break; case OCCUPANCY_E: case OCCUPANCY_F: case
			 * OCCUPANCY_F4: processCoverage(pl,
			 * mostRestrictiveOccupancy.getOccupancyTypeVal(), totalCoverage, Seventy);
			 * break;
			 * 
			 * case OCCUPANCY_G2: processCoverage(pl,
			 * mostRestrictiveOccupancy.getOccupancyTypeVal(), totalCoverage, SeventyFive);
			 * break; case OCCUPANCY_H: processCoverage(pl,
			 * mostRestrictiveOccupancy.getOccupancyTypeVal(), totalCoverage, Eighty);
			 * break; default: break; } } } }
			 */
        return pl;
    }

	/*
	 * private BigDecimal getPermissibleCoverage(OccupancyType type) { switch (type)
	 * { case OCCUPANCY_B1: case OCCUPANCY_B2: case OCCUPANCY_B3: return ThirtyFive;
	 * 
	 * case OCCUPANCY_D: case OCCUPANCY_D1: case OCCUPANCY_I2: return Forty;
	 * 
	 * case OCCUPANCY_I1: return FortyFive;
	 * 
	 * case OCCUPANCY_C: return Sixty;
	 * 
	 * case OCCUPANCY_A1: case OCCUPANCY_A4: case OCCUPANCY_A2: case OCCUPANCY_G1:
	 * return SixtyFive;
	 * 
	 * case OCCUPANCY_E: case OCCUPANCY_F: case OCCUPANCY_F4: return Seventy;
	 * 
	 * case OCCUPANCY_G2: return SeventyFive;
	 * 
	 * case OCCUPANCY_H: return Eighty; default: return BigDecimal.ZERO; } }
	 */
    private void processCoverage(Plan pl, String occupancy, BigDecimal coverage, BigDecimal upperLimit) {
        ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
        scrutinyDetail.setKey("Common_Coverage");
        scrutinyDetail.setHeading("Coverage in Percentage");
        scrutinyDetail.addColumnHeading(1, RULE_NO);
        scrutinyDetail.addColumnHeading(2, DESCRIPTION);
        //scrutinyDetail.addColumnHeading(3, OCCUPANCY);
        scrutinyDetail.addColumnHeading(4, PERMISSIBLE);
        scrutinyDetail.addColumnHeading(5, PROVIDED);
        scrutinyDetail.addColumnHeading(6, STATUS);

        String desc = getLocaleMessage(RULE_DESCRIPTION_KEY, upperLimit.toString());
        String actualResult = getLocaleMessage(RULE_ACTUAL_KEY, coverage.toString());
        String expectedResult = getLocaleMessage(RULE_EXPECTED_KEY, upperLimit.toString());
        if (coverage.doubleValue() <= upperLimit.doubleValue()) {
            Map<String, String> details = new HashMap<>();
            details.put(RULE_NO, RULE_38);
            details.put(DESCRIPTION, desc);
           // details.put(OCCUPANCY, occupancy);
            details.put(PERMISSIBLE, expectedResult);
            details.put(PROVIDED, actualResult);
            details.put(STATUS, Result.Accepted.getResultVal());
            scrutinyDetail.getDetail().add(details);
            pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

        } else {
            Map<String, String> details = new HashMap<>();
            details.put(RULE_NO, RULE_38);
            details.put(DESCRIPTION, desc);
           // details.put(OCCUPANCY, occupancy);
            details.put(PERMISSIBLE, expectedResult);
            details.put(PROVIDED, actualResult);
            details.put(STATUS, Result.Not_Accepted.getResultVal());
            scrutinyDetail.getDetail().add(details);
            pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

        }

    }

    protected OccupancyType getMostRestrictiveCoverage(EnumSet<OccupancyType> distinctOccupancyTypes) {

        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_B1))
            return OccupancyType.OCCUPANCY_B1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_B2))
            return OccupancyType.OCCUPANCY_B2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_B3))
            return OccupancyType.OCCUPANCY_B3;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_D))
            return OccupancyType.OCCUPANCY_D;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_D1))
            return OccupancyType.OCCUPANCY_D1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_I2))
            return OccupancyType.OCCUPANCY_I2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_I1))
            return OccupancyType.OCCUPANCY_I1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_C))
            return OccupancyType.OCCUPANCY_C;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_A1))
            return OccupancyType.OCCUPANCY_A1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_A4))
            return OccupancyType.OCCUPANCY_A4;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_A2))
            return OccupancyType.OCCUPANCY_A2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_G1))
            return OccupancyType.OCCUPANCY_G1;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_E))
            return OccupancyType.OCCUPANCY_E;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_F))
            return OccupancyType.OCCUPANCY_F;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_F4))
            return OccupancyType.OCCUPANCY_F4;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_G2))
            return OccupancyType.OCCUPANCY_G2;
        if (distinctOccupancyTypes.contains(OccupancyType.OCCUPANCY_H))
            return OccupancyType.OCCUPANCY_H;

        else
            return null;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
