package org.egov.edcr.feature;

import java.math.BigDecimal;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StairCoverExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(StairCoverExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        BigDecimal minHeight, increasedHeight;
        for (Block block : planDetail.getBlocks()) {
            block.setStairCovers(Util.getListOfDimensionValueByLayer(planDetail,
                    String.format(layerNames.getLayerName("LAYER_NAME_STAIR_COVER"), block.getNumber())));

            if (block.getStairCovers() != null && !block.getStairCovers().isEmpty()) {
                minHeight = block.getStairCovers().stream().reduce(BigDecimal::min).get();
                if (minHeight.compareTo(new BigDecimal(3)) > 0) {
                    increasedHeight = block.getBuilding().getBuildingHeight()
                            .subtract(block.getBuilding().getDeclaredBuildingHeight());
                    if (minHeight.compareTo(increasedHeight) > 0) {
                        block.getBuilding()
                                .setBuildingHeight(block.getBuilding().getDeclaredBuildingHeight().add(minHeight));
                        block.getBuilding().setHeightIncreasedBy("Stair Cover");
                    }
                }
            }

            if (block.getBuilding().getBuildingHeight().compareTo(new BigDecimal(15)) > 0)
                block.getBuilding().setIsHighRise(true);
        }

        return planDetail;
    }

}
