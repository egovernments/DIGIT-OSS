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
public class RoofTankExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(RoofTankExtract.class);
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
            block.setRoofTanks(Util.getListOfDimensionValueByLayer(planDetail,
                    String.format(layerNames.getLayerName("LAYER_NAME_ROOF_TANK"), block.getNumber())));

            if (block.getRoofTanks() != null && !block.getRoofTanks().isEmpty()) {
                minHeight = block.getRoofTanks().stream().reduce(BigDecimal::min).get();
                if (minHeight.compareTo(new BigDecimal(1)) > 0) {
                    increasedHeight = block.getBuilding().getBuildingHeight()
                            .subtract(block.getBuilding().getDeclaredBuildingHeight());
                    if (minHeight.compareTo(increasedHeight) > 0) {
                        block.getBuilding()
                                .setBuildingHeight(block.getBuilding().getDeclaredBuildingHeight().add(minHeight));
                        block.getBuilding().setHeightIncreasedBy("Roof Tank");
                    }
                }
            }

            if (block.getBuilding().getBuildingHeight().compareTo(new BigDecimal(15)) > 0)
                block.getBuilding().setIsHighRise(true);
        }

        return planDetail;
    }

}
