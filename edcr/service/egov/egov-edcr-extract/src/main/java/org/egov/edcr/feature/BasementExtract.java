package org.egov.edcr.feature;

import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BasementExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(BasementExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        Map<String, Integer> basementFeaturesColor = pl.getSubFeatureColorCodesMaster().get("Basement");
        for (Block b : pl.getBlocks())
            if (b.getBuilding() != null && b.getBuilding().getFloors() != null
                    && !b.getBuilding().getFloors().isEmpty())
                for (Floor f : b.getBuilding().getFloors())
                    if (f.getNumber() == -1) {
                        String basementFootPrint = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + b.getNumber()
                                + "_"+ layerNames.getLayerName("LAYER_NAME_LEVEL_NAME_PREFIX") + f.getNumber()
                                + "_"+ layerNames.getLayerName("LAYER_NAME_BSMNT_FOOT_PRINT");
                        /*
                         * height from the floor to the soffit of the roof slab or ceiling
                         */
                        f.setHeightFromTheFloorToCeiling(Util.getListOfDimensionByColourCode(pl,
                                String.format(basementFootPrint,
                                        b.getNumber()),
                                basementFeaturesColor.get(layerNames
                                        .getLayerName("LAYER_NAME_HEIGHT_FROM_THE_FLOOR_TO_CEILING_COLOUR_CODE"))));
                        
                        /*
                         * minimum height of the ceiling of upper basement above ground level
                         */
                        f.setHeightOfTheCeilingOfUpperBasement(Util.getListOfDimensionByColourCode(pl,
                                String.format(basementFootPrint,
                                        b.getNumber()),
                                basementFeaturesColor.get(layerNames.getLayerName(
                                        "LAYER_NAME_HEIGHT_OF_THE_CEILING_OF_UPPER_BASEMENT_COLOUR_CODE"))));
                        
                        /*
                         * Level of basement under the ground
                         */
                        f.setLevelOfBasementUnderGround(Util.getListOfDimensionByColourCode(pl,
                                String.format(basementFootPrint,
                                        b.getNumber()),
                                basementFeaturesColor.get(layerNames.getLayerName(
                                        "LAYER_NAME_COLOUR_CODE_LEVEL_OF_BASEMENT_UNDER_GROUND"))));

                    }

        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
