package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.stereotype.Service;

@Service
public class OpenStairService extends FeatureProcess {
    private static final Logger LOG = LogManager.getLogger(OpenStairService.class);
    private static final String SUB_RULE_24_11 = "24-11";
    private static final BigDecimal OPENSTAIR_DISTANCE = BigDecimal.valueOf(0.60);

    @Override
    public Plan validate(Plan plan) {

        return plan;
    }

    @Override
    public Plan process(Plan plan) {/*
                                     * List<Block> blocks = plan.getBlocks(); for (Block block : blocks) { if (block.getBuilding()
                                     * != null && block.getOpenStairs() != null && block.getOpenStairs().size() > 0) {
                                     * scrutinyDetail = new ScrutinyDetail(); scrutinyDetail.addColumnHeading(1, RULE_NO);
                                     * scrutinyDetail.addColumnHeading(2, REQUIRED); scrutinyDetail.addColumnHeading(3, PROVIDED);
                                     * scrutinyDetail.addColumnHeading(4, STATUS); scrutinyDetail.setHeading("Open Stair");
                                     * scrutinyDetail.setKey("Block_" + block.getName() + "_OPEN STAIR"); for (Measurement
                                     * measurement : block.getOpenStairs()) { if (measurement.getMinimumDistance().setScale(2,
                                     * RoundingMode.HALF_UP).compareTo(OPENSTAIR_DISTANCE) >= 0) { setReportOutputDetails(plan,
                                     * SUB_RULE_24_11, String.format(SUB_RULE_24_11, block.getNumber()),
                                     * OPENSTAIR_DISTANCE.toString(), measurement.getMinimumDistance().toString(),
                                     * Result.Accepted.getResultVal(), scrutinyDetail); } else { setReportOutputDetails(plan,
                                     * SUB_RULE_24_11, String.format(SUB_RULE_24_11, block.getNumber()),
                                     * OPENSTAIR_DISTANCE.toString(), measurement.getMinimumDistance().toString(),
                                     * Result.Not_Accepted.getResultVal(), scrutinyDetail); } } } }
                                     */

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
