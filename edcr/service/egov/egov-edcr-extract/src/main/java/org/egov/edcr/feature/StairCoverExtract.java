package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.Optional;

import org.egov.common.entity.edcr.Block;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StairCoverExtract extends FeatureExtract {
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        BigDecimal minHeight;
        BigDecimal increasedHeight;
        for (Block block : planDetail.getBlocks()) {
            block.setStairCovers(Util.getListOfDimensionValueByLayer(planDetail,
                    String.format(layerNames.getLayerName("LAYER_NAME_STAIR_COVER"), block.getNumber())));

            if (block.getStairCovers() != null && !block.getStairCovers().isEmpty()) {
                Optional<BigDecimal> stairMinHght = block.getStairCovers().stream().reduce(BigDecimal::min);
				minHeight = stairMinHght.isPresent() ? stairMinHght.get() : BigDecimal.ZERO;
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
