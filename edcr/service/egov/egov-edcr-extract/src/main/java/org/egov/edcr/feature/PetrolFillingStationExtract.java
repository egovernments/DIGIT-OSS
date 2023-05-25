package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PetrolFillingStationExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(PetrolFillingStationExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Petrol Filling Station Extract......");
        String layer = layerNames.getLayerName("LAYER_NAME_CANOPY");
        List<BigDecimal> canopyDistanceFromPlotBoundary = Util.getListOfDimensionValueByLayer(pl, layer);
        pl.setCanopyDistanceFromPlotBoundary(canopyDistanceFromPlotBoundary);
        if (LOG.isDebugEnabled())
            LOG.debug("End of Petrol Filling Station Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
