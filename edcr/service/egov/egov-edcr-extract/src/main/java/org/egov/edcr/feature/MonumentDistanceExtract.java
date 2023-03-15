package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MonumentDistanceExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(MonumentDistanceExtract.class);

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        List<BigDecimal> distancesFromMonument = Util.getListOfDimensionValueByLayer(pl,
                layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_MONUMENT"));
        pl.getDistanceToExternalEntity().setMonuments(distancesFromMonument);

        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
