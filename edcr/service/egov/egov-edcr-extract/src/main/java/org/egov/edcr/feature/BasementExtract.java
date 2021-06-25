package org.egov.edcr.feature;

import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BasementExtract extends FeatureExtract {

    private static final Logger LOG = Logger.getLogger(BasementExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        Map<String, Integer> sanitatioFeaturesColor = pl.getSubFeatureColorCodesMaster().get("Basement");
        for (Block b : pl.getBlocks())
            if (b.getBuilding() != null && b.getBuilding().getFloors() != null
                    && !b.getBuilding().getFloors().isEmpty())
                for (Floor f : b.getBuilding().getFloors())
                    if (f.getNumber() == -1) {

                        f.setHeightFromTheFloorToCeiling(Util.getListOfDimensionByColourCode(pl,
                                String.format(layerNames.getLayerName("LAYER_NAME_BLK_FLR_BLDG_FOOTPRINT"),
                                        b.getNumber()),
                                sanitatioFeaturesColor.get(layerNames
                                        .getLayerName("LAYER_NAME_HEIGHT_FROM_THE_FLOOR_TO_CEILING_COLOUR_CODE"))));

                        f.setHeightOfTheCeilingOfUpperBasement(Util.getListOfDimensionByColourCode(pl,
                                String.format(layerNames.getLayerName("LAYER_NAME_BLK_FLR_BLDG_FOOTPRINT"),
                                        b.getNumber()),
                                sanitatioFeaturesColor.get(layerNames.getLayerName(
                                        "LAYER_NAME_HEIGHT_OF_THE_CEILING_OF_UPPER_BASEMENT_COLOUR_CODE"))));

                    }

        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
